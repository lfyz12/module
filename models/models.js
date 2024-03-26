const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Users = sequelize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    first_name: {type: DataTypes.STRING, allowNull: false},
    last_name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    token: {type: DataTypes.STRING, allowNull: true}
});

const Files = sequelize.define('files', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    file_path: {type: DataTypes.STRING, allowNull: false},
    // user_id: {type: DataTypes.INTEGER, allowNull: false}
})

const Permissions = sequelize.define('permissions', {
    permission_id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    // file_id: {type: DataTypes.INTEGER, allowNull: false},
    // user_id: {type: DataTypes.INTEGER, allowNull: false},
    read_access: {type: DataTypes.BOOLEAN, allowNull: false},
    edit_access: {type: DataTypes.BOOLEAN, allowNull: false},
    delete_access: {type: DataTypes.BOOLEAN, allowNull: false}
})

Users.hasMany(Files)
Files.belongsTo(Users)

Users.hasMany(Permissions)
Permissions.belongsTo(Users)

Files.hasMany(Permissions)
Permissions.belongsTo(Files)

module.exports = {
    Users,
    Files,
    Permissions
}
    
