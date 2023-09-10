export default class UserDto {
    constructor(user) {
        this.id = user._id
        this.fullname = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.role = user.role
        this.avatar = user.avatar || 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'
    }
}