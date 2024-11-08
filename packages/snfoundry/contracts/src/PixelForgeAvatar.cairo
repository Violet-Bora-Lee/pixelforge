use starknet::{ContractAddress};

#[derive(Drop, Serde)]
pub struct AccessoryInfo {
    pub affiliate_id: felt252,
    pub accessory_id: felt252,
    pub is_on: bool,
}

#[starknet::interface]
pub trait IPixelForgeAvatar<TContractState> {
    // mint your own avatar
    fn mint(ref self: TContractState);
    fn update_accessories(ref self: TContractState, accessory_list: Span<AccessoryInfo>);
    fn register_affiliate(ref self: TContractState, affiliate_id: felt252, contract_address: ContractAddress);
    fn register_accessory(ref self: TContractState, affiliate_id: felt252, accessory_id: felt252);
    fn has_accessory(self: @TContractState, token_id: u256, affiliate_id: felt252, accessory_id: felt252) -> bool;
    fn get_accessories_for_affiliate(self: @TContractState, affiliate_id: felt252) -> Span<felt252>;
    fn get_affiliates(self: @TContractState) -> Span<felt252>;
    // ERC721 overrides
    fn name(self: @TContractState) -> ByteArray;
    fn symbol(self: @TContractState) -> ByteArray;
    fn token_uri(self: @TContractState, token_id: u256) -> ByteArray;
}

#[starknet::contract]
mod PixelForgeAvatar {
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_token::erc721::interface::{ERC721ABIDispatcher, ERC721ABIDispatcherTrait};
    use openzeppelin_token::erc721::ERC721Component;
    use openzeppelin_token::erc721::ERC721Component::ERC721HooksTrait;
    use openzeppelin_introspection::src5::SRC5Component;
    use starknet::{get_caller_address, ContractAddress};
    use starknet::storage::{Map, StoragePathEntry, Vec, VecTrait, MutableVecTrait};
    use core::num::traits::Zero;
    use super::{IPixelForgeAvatar, AccessoryInfo};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    #[abi(embed_v0)]
    // Don't embed entire ERC721 ABI because we need to override some methods
    // impl ERC721MixinImpl = ERC721Component::ERC721MixinImpl<ContractState>;
    impl ERC721Impl = ERC721Component::ERC721Impl<ContractState>;
    impl ERC721MetadataImpl = ERC721Component::ERC721MetadataImpl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;
    
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

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
        // token_id -> affiliate_id -> accessory_id -> is_on
        item_accessories: Map<u256, Map<felt252, Map<felt252, bool>>>,
        // affiliate_id -> contract_address
        affiliate_contracts: Map<felt252, ContractAddress>,
        all_affiliates_list: Vec<felt252>,
        all_accessories_list: Map<felt252, Vec<felt252>>,
        #[substorage(v0)]
        erc721: ERC721Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        src5: SRC5Component::Storage,
        accessory_info: AccessoryInfo,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress, base_uri: ByteArray) {
        self.erc721.initializer("PixelForge Wardrobe Key", "PFWK", base_uri);
        self.ownable.initializer(owner);
    }

    #[abi(embed_v0)]
    impl PixelForgeAvatarImpl of IPixelForgeAvatar<ContractState> {
        fn mint(ref self: ContractState) {
            let caller = get_caller_address();

            // mint a new token (the token id is the caller's address)
            // mint will check if the token is already minted, and if so, reject
            let caller_as_felt: felt252 = caller.into();
            self.erc721.mint(caller, caller_as_felt.into());
        }

        fn update_accessories(ref self: ContractState, accessory_list: Span<AccessoryInfo>) {
            // get the token of the caller
            let caller = get_caller_address();
            let caller_as_felt: felt252 = caller.into();
            let token_id = caller_as_felt.into();

            // check if the caller has the token
            let owner = self.erc721.owner_of(token_id);
            assert(owner == caller, 'Caller does not own the token');

            // Oh that will take a lot of gas
            for accessory in accessory_list {
                // for each accessory in the list, load the key contract
                let key_contract_address = self.affiliate_contracts.entry(*accessory.affiliate_id).read();
                assert(!key_contract_address.is_zero(), 'Affiliate key not registered');
                // check if the caller has the key
                let key_contract = ERC721ABIDispatcher {
                    contract_address: key_contract_address,
                };
                let has_key = key_contract.balance_of(caller) > 0;
                // get the current state of the accessory
                let current_state = self.item_accessories.entry(token_id).entry(*accessory.affiliate_id).entry(*accessory.accessory_id).read();
                // if they don't have accessory on, and they want to turn it on, check if they have the key
                if !current_state && *accessory.is_on {
                    assert(has_key, 'Caller does not have the key');
                }
                // write the new state
                self.item_accessories.entry(token_id).entry(*accessory.affiliate_id).entry(*accessory.accessory_id).write(*accessory.is_on);
            }
        }
        fn register_affiliate(ref self: ContractState, affiliate_id: felt252, contract_address: ContractAddress) {
            self.ownable.assert_only_owner();
            self.affiliate_contracts.entry(affiliate_id).write(contract_address);
            self.all_affiliates_list.append().write(affiliate_id);
        }
        // Registers an accessory for an affiliate
        // Now serves purely for enumeration, but could be used for accessory validation in the future
        fn register_accessory(ref self: ContractState, affiliate_id: felt252, accessory_id: felt252) {
            self.ownable.assert_only_owner();
            self.all_accessories_list.entry(affiliate_id).append().write(accessory_id);
        }
        fn has_accessory(self: @ContractState, token_id: u256, affiliate_id: felt252, accessory_id: felt252) -> bool {
            self.item_accessories.entry(token_id).entry(affiliate_id).entry(accessory_id).read()
        }
        fn get_accessories_for_affiliate(self: @ContractState, affiliate_id: felt252) -> Span<felt252> {
            let mut accessories_arr = array![];
            let registered_accessories = self.all_accessories_list.entry(affiliate_id);
            let len = registered_accessories.len();
            for i in 0..len {
                accessories_arr.append(registered_accessories.at(i).read());
            };
            accessories_arr.span()
        }
        fn get_affiliates(self: @ContractState) -> Span<felt252> {
            let mut affiliates_arr = array![];
            let len = self.all_affiliates_list.len();
            for i in 0..len {
                affiliates_arr.append(self.all_affiliates_list.at(i).read());
            };
            affiliates_arr.span()
        }
        fn token_uri(self: @ContractState, token_id: u256) -> ByteArray {
            // Check if token exists (done by ERC721)
            let _ = self.erc721.owner_of(token_id);

            let mut token_uri = self.erc721._base_uri();

            // Iterate over all accessories and compose the URL from weared ones:
            // http://base_uri?aff[0]=bored_apes&acc[0][0]=hat&acc[0][1]=t-shirt&aff[1]=oxford&acc[1][0]=hat

            for i in 0..self.all_affiliates_list.len() {
                let affiliate_id = self.all_affiliates_list.at(i).read();
                let accessories = self.all_accessories_list.entry(affiliate_id);
                let mut aff_used = false;
                for j in 0..accessories.len() {
                    if !aff_used {
                        token_uri = format!("{}&aff[{}]={}", token_uri, i, affiliate_id);
                        aff_used = true;
                    }
                    let accessory_id = accessories.at(j).read();
                    let is_on = self.item_accessories.entry(token_id).entry(affiliate_id).entry(accessory_id).read();
                    if is_on {
                        token_uri = format!("{}&acc[{}][{}]={}", token_uri, i, j, accessory_id);
                    }
                }
            };

            token_uri
        }
        fn name(self: @ContractState) -> ByteArray {
            self.erc721.name()
        }
        fn symbol(self: @ContractState) -> ByteArray {
            self.erc721.symbol()
        }
    }

    impl ERC721HooksImpl of ERC721HooksTrait<ContractState> {
        fn before_update(
            ref self: ERC721Component::ComponentState<ContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress
        ) {
            // Don't allow updates not from zero address (i.e. only mints)
            // Self-burns are disallowed by ERC721 spec
            let from = self._owner_of(token_id);
            assert(from.is_zero(), 'Transfer not allowed');
        }

        fn after_update(
            ref self: ERC721Component::ComponentState<ContractState>,
            to: ContractAddress,
            token_id: u256,
            auth: ContractAddress
        ) {}
    }
}
