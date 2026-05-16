// tiap request di endpoint tertentu
interface ChangePassword {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}
interface Login {
    username: string,
    password: string
}
interface ResetPassword {
    userId: string
}
interface ManualAttandance {
    npm: string
}
interface ScanAttandance {
    token: string
}

export type { ChangePassword, Login, ResetPassword, ManualAttandance, ScanAttandance }
