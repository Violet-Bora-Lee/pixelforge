use contracts::WardrobeKey::{IWardrobeKeyDispatcher, IWardrobeKeyDispatcherTrait};
use openzeppelin_token::erc721::interface::{IERC721Dispatcher, IERC721DispatcherTrait};
use openzeppelin_utils::serde::SerializedAppend;
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait, start_prank, stop_prank};
use starknet::{ContractAddress, contract_address_const, get_caller_address};

fn OWNER() -> ContractAddress {
    contract_address_const::<'OWNER'>()
}

fn USER() -> ContractAddress {
    contract_address_const::<'USER'>()
}

fn deploy_wardrobe_key() -> ContractAddress {
    let contract = declare("WardrobeKey").unwrap().contract_class();
    let mut calldata = array![];
    calldata.append_serde(OWNER()); // owner address
    calldata.append_serde("https://api.example.com/token/"); // base_uri
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    contract_address
}

#[test]
fn test_deployment() {
    let contract_address = deploy_wardrobe_key();
    let dispatcher = IERC721Dispatcher { contract_address };
    
    assert(dispatcher.name() == "PixelForge Wardrobe Key", 'Wrong name');
    assert(dispatcher.symbol() == "PFWK", 'Wrong symbol');
}

#[test]
fn test_minting() {
    let contract_address = deploy_wardrobe_key();
    let dispatcher = IWardrobeKeyDispatcher { contract_address };
    let erc721_dispatcher = IERC721Dispatcher { contract_address };
    
    // Start acting as owner
    start_prank(contract_address, OWNER());
    
    // Mint token ID 1 to USER
    dispatcher.mint(USER(), 1);
    
    // Verify ownership
    assert(erc721_dispatcher.owner_of(1) == USER(), 'Wrong token owner');
    assert(erc721_dispatcher.balance_of(USER()) == 1, 'Wrong balance');
    
    stop_prank(contract_address);
}

#[test]
#[should_panic(expected: ('Caller is not the owner',))]
fn test_mint_not_owner() {
    let contract_address = deploy_wardrobe_key();
    let dispatcher = IWardrobeKeyDispatcher { contract_address };
    
    // Try to mint as non-owner (default caller)
    start_prank(contract_address, USER());
    dispatcher.mint(USER(), 1);
    stop_prank(contract_address);
} 