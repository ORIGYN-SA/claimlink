use crate::state::read_state;

pub fn _caller_is_authorised_principal() -> Result<(), String> {
    if read_state(|state| state.is_caller_authorised_principal()) {
        Ok(())
    } else {
        Err("Caller is not an authorised principal".to_string())
    }
}

pub fn reject_anonymous_caller() -> Result<(), String> {
    if ic_cdk::api::msg_caller() == candid::Principal::anonymous() {
        return Err("You may not use an anonymous principal".to_string());
    }
    Ok(())
}
