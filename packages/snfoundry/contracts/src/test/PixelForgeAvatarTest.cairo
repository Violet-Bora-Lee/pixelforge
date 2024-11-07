use contracts::PixelForgeAvatar::{IPixelForgeAvatarDispatcher, IPixelForgeAvatarDispatcherTrait, AccessoryInfo};
use contracts::WardrobeKey::{IWardrobeKeyDispatcher, IWardrobeKeyDispatcherTrait};
use openzeppelin_token::erc721::interface::{ERC721ABIDispatcher, ERC721ABIDispatcherTrait};
use openzeppelin_utils::serde::SerializedAppend;
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait, start_cheat_caller_address, stop_cheat_caller_address};
use starknet::{ContractAddress, contract_address_const};

fn OWNER() -> ContractAddress {
    contract_address_const::<'OWNER'>()
}

fn USER() -> ContractAddress {
    contract_address_const::<'USER'>()
}

fn USER2() -> ContractAddress {
    contract_address_const::<'USER2'>()
}

fn deploy_avatar() -> ContractAddress {
    let contract = declare("PixelForgeAvatar").unwrap().contract_class();
    let mut calldata = array![];
    calldata.append_serde(OWNER()); // owner address
    let base_uri: ByteArray = "https://api.example.com/avatar/";
    calldata.append_serde(base_uri); // base_uri
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    contract_address
}

fn deploy_wardrobe_key() -> ContractAddress {
    let contract = declare("WardrobeKey").unwrap().contract_class();
    let mut calldata = array![];
    calldata.append_serde(OWNER()); // owner address
    let base_uri: ByteArray = "https://api.example.com/key/";
    calldata.append_serde(base_uri); // base_uri
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    contract_address
}

#[test]
fn test_deployment() {
    let contract_address = deploy_avatar();
    let dispatcher = ERC721ABIDispatcher { contract_address };
    
    assert(dispatcher.name() == "PixelForge Wardrobe Key", 'Wrong name');
    assert(dispatcher.symbol() == "PFWK", 'Wrong symbol');
}

#[test]
fn test_minting() {
    let contract_address = deploy_avatar();
    let dispatcher = IPixelForgeAvatarDispatcher { contract_address };
    let erc721_dispatcher = ERC721ABIDispatcher { contract_address };
    
    // Start acting as USER
    start_cheat_caller_address(contract_address, USER());

    // Mint avatar - token ID will be USER's address as felt252
    dispatcher.mint();

    // Convert USER address to felt252 for token_id
    let user_felt: felt252 = USER().into();
    let token_id: u256 = user_felt.into();

    // Verify ownership
    assert(erc721_dispatcher.owner_of(token_id) == USER(), 'Wrong token owner');
    assert(erc721_dispatcher.balance_of(USER()) == 1, 'Wrong balance');
    
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_accessory_management() {
    // Deploy contracts
    let avatar_address = deploy_avatar();
    let key_address = deploy_wardrobe_key();
    
    let avatar = IPixelForgeAvatarDispatcher { contract_address: avatar_address };
    let key = IWardrobeKeyDispatcher { contract_address: key_address };
    
    // Register affiliate (wardrobe key contract)
    start_cheat_caller_address(avatar_address, OWNER());
    let affiliate_id: felt252 = 'test_affiliate';
    avatar.register_affiliate(affiliate_id, key_address);
    stop_cheat_caller_address(avatar_address);

    // Mint key to USER
    start_cheat_caller_address(key_address, OWNER());
    key.mint(USER());
    stop_cheat_caller_address(key_address);

    // USER mints avatar and tries to equip accessory
    start_cheat_caller_address(avatar_address, USER());
    avatar.mint();

    let user_felt: felt252 = USER().into();
    let token_id: u256 = user_felt.into();

    let accessory_id: felt252 = 'test_hat';
    let accessory = AccessoryInfo { 
        affiliate_id: affiliate_id, 
        accessory_id: accessory_id, 
        is_on: true 
    };
    
    let mut accessories = array![accessory];
    avatar.update_accessories(accessories.span());

    // Verify accessory is equipped
    assert(avatar.has_accessory(token_id, affiliate_id, accessory_id), 'Accessory not equipped');
    
    stop_cheat_caller_address(avatar_address);
}

#[test]
#[should_panic(expected: ('Caller does not own the token',))]
fn test_cant_update_others_avatar() {
    let avatar_address = deploy_avatar();
    let avatar = IPixelForgeAvatarDispatcher { contract_address: avatar_address };

    // USER mints avatar
    start_cheat_caller_address(avatar_address, USER());
    avatar.mint();
    stop_cheat_caller_address(avatar_address);

    // USER2 tries to update USER's avatar
    start_cheat_caller_address(avatar_address, USER2());
    let accessory = AccessoryInfo { 
        affiliate_id: 'test_affiliate', 
        accessory_id: 'test_hat', 
        is_on: true 
    };
    let mut accessories = array![accessory];
    avatar.update_accessories(accessories.span());
}

#[test]
#[should_panic(expected: ('Transfer not allowed',))]
fn test_cant_transfer_avatar() {
    let avatar_address = deploy_avatar();
    let avatar = IPixelForgeAvatarDispatcher { contract_address: avatar_address };
    let erc721_dispatcher = ERC721ABIDispatcher { contract_address: avatar_address };

    // USER mints avatar
    start_cheat_caller_address(avatar_address, USER());
    avatar.mint();
    
    let user_felt: felt252 = USER().into();
    let token_id: u256 = user_felt.into();

    // Try to transfer to USER2
    erc721_dispatcher.transfer_from(USER(), USER2(), token_id);
}

#[test]
fn test_token_uri_generation() {
    let avatar_address = deploy_avatar();
    let key1_address = deploy_wardrobe_key();
    let key2_address = deploy_wardrobe_key();
    
    let avatar = IPixelForgeAvatarDispatcher { contract_address: avatar_address };
    let key1 = IWardrobeKeyDispatcher { contract_address: key1_address };
    let key2 = IWardrobeKeyDispatcher { contract_address: key2_address };
    
    // Register two affiliates
    start_cheat_caller_address(avatar_address, OWNER());
    let affiliate1: felt252 = 'bored_apes';
    let affiliate2: felt252 = 'oxford';
    avatar.register_affiliate(affiliate1, key1_address);
    avatar.register_affiliate(affiliate2, key2_address);
    stop_cheat_caller_address(avatar_address);

    // Mint keys to USER
    start_cheat_caller_address(key1_address, OWNER());
    key1.mint(USER());
    stop_cheat_caller_address(key1_address);
    
    start_cheat_caller_address(key2_address, OWNER());
    key2.mint(USER());
    stop_cheat_caller_address(key2_address);

    // USER mints avatar and equips accessories
    start_cheat_caller_address(avatar_address, USER());
    avatar.mint();

    let user_felt: felt252 = USER().into();
    let token_id: u256 = user_felt.into();

    // Create accessories list with items from both affiliates
    let accessory1 = AccessoryInfo { 
        affiliate_id: affiliate1, 
        accessory_id: 'hat', 
        is_on: true 
    };
    let accessory2 = AccessoryInfo { 
        affiliate_id: affiliate1, 
        accessory_id: 't-shirt', 
        is_on: true 
    };
    let accessory3 = AccessoryInfo { 
        affiliate_id: affiliate2, 
        accessory_id: 'glasses', 
        is_on: true 
    };
    
    let mut accessories = array![accessory1, accessory2, accessory3];
    avatar.update_accessories(accessories.span());

    // Get and verify token URI
    let token_uri = avatar.token_uri(token_id);
    
    // The URI should contain base_uri + all equipped accessories in order
    // Expected format: https://api.example.com/avatar/?aff[0]=bored_apes&acc[0][0]=hat&acc[0][1]=t-shirt&aff[1]=oxford&acc[1][0]=glasses
    let expected_uri: ByteArray = "https://api.example.com/avatar/&aff[0]=bored_apes&acc[0][0]=hat&acc[0][1]=t-shirt&aff[1]=oxford&acc[1][0]=glasses";
    assert(token_uri == expected_uri, 'Wrong token URI generated');
    
    stop_cheat_caller_address(avatar_address);
}

#[test]
#[should_panic(expected: ('Token does not exist',))]
fn test_token_uri_nonexistent() {
    let avatar_address = deploy_avatar();
    let avatar = IPixelForgeAvatarDispatcher { contract_address: avatar_address };
    
    // Try to get URI for non-existent token
    avatar.token_uri(99999.into());
}