import { QueryInterface, DataTypes } from "sequelize";

export default {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable("highlighted_ips", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            ip_address: {
                type: DataTypes.STRING(45),
                allowNull: false,
                unique: true,
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            note: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            created_by: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });

        await queryInterface.addIndex("highlighted_ips", ["ip_address"]);
        await queryInterface.addIndex("highlighted_ips", ["is_active"]);
        await queryInterface.addIndex("highlighted_ips", ["created_at"]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable("highlighted_ips");
    },
};
