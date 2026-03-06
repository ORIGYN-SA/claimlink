use candid::{CandidType, Deserialize, Nat};

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Icrc21ConsentMessageMetadata {
    pub language: String,
    pub utc_offset_minutes: Option<i16>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum Icrc21DeviceSpec {
    GenericDisplay,
    FieldsDisplay,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Icrc21ConsentMessageSpec {
    pub metadata: Icrc21ConsentMessageMetadata,
    pub device_spec: Option<Icrc21DeviceSpec>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Icrc21ConsentMessageRequest {
    pub method: String,
    pub arg: Vec<u8>,
    pub user_preferences: Icrc21ConsentMessageSpec,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct TokenAmount {
    pub decimals: u8,
    pub amount: u64,
    pub symbol: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct TimestampSeconds {
    pub amount: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct DurationSeconds {
    pub amount: u64,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct TextValue {
    pub content: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum Value {
    TokenAmount(TokenAmount),
    TimestampSeconds(TimestampSeconds),
    DurationSeconds(DurationSeconds),
    Text(TextValue),
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Icrc21FieldDisplayMessage {
    pub intent: String,
    pub fields: Vec<(String, Value)>,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum Icrc21ConsentMessage {
    GenericDisplayMessage(String),
    FieldsDisplayMessage(Icrc21FieldDisplayMessage),
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Icrc21ConsentInfo {
    pub consent_message: Icrc21ConsentMessage,
    pub metadata: Icrc21ConsentMessageMetadata,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Icrc21ErrorInfo {
    pub description: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct Icrc21GenericError {
    pub error_code: Nat,
    pub description: String,
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum Icrc21Error {
    UnsupportedCanisterCall(Icrc21ErrorInfo),
    ConsentMessageUnavailable(Icrc21ErrorInfo),
    InsufficientPayment(Icrc21ErrorInfo),
    GenericError(Icrc21GenericError),
}

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum Icrc21ConsentMessageResponse {
    Ok(Icrc21ConsentInfo),
    Err(Icrc21Error),
}

pub type Args = Icrc21ConsentMessageRequest;
pub type Response = Icrc21ConsentMessageResponse;
