use starknet::{ContractAddress};

#[starknet::interface]
pub trait IWardrobeKey<TContractState> {
    fn mint(ref self: TContractState, to: ContractAddress, tokenId: u256);
}

#[starknet::contract]
mod WardrobeKey {
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use openzeppelin_introspection::src5::SRC5Component;
    use starknet::ContractAddress;
    use super::{IWardrobeKey};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    #[abi(embed_v0)]
    impl SRC5Impl = SRC5Component::SRC5Impl<ContractState>;

    #[abi(embed_v0)]
    impl ERC721Impl = ERC721Component::ERC721Impl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;
    
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    const ETH_CONTRACT_ADDRESS: felt252 =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    #[storage]
    struct Storage {
        greeting: ByteArray,
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress, base_uri: ByteArray) {
        self.erc721.initializer("PixelForge Wardrobe Key", "PFWK", base_uri);
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl WardrobeKeyImpl of IWardrobeKey<ContractState> {
        fn mint(ref self: ContractState, to: ContractAddress, tokenId: u256) {
            self.erc721.mint(to, tokenId);
        }
    }
}
