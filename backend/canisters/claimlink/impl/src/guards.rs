use crate::state::{mutate_state, read_state};

pub fn caller_is_authorised_principal() -> Result<(), String> {
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

#[derive(Debug, Hash, Copy, Clone, PartialEq, Eq)]
pub enum TaskType {
    RetryFailedInstallation,
    Reimbursement,
}

#[derive(Debug, PartialEq, Eq)]
pub struct TimerGuard {
    task: TaskType,
}
#[derive(Debug, PartialEq, Eq)]
pub enum TimerGuardError {
    AlreadyProcessing,
}

impl TimerGuard {
    pub fn new(task: TaskType) -> Result<Self, TimerGuardError> {
        mutate_state(|s| {
            if !s.data.active_tasks.insert(task) {
                return Err(TimerGuardError::AlreadyProcessing);
            }
            Ok(Self { task })
        })
    }
}

impl Drop for TimerGuard {
    fn drop(&mut self) {
        mutate_state(|s| {
            s.data.active_tasks.remove(&self.task);
        });
    }
}
