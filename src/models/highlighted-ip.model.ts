import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface HighlightedIPAttributes {
    id: number;
    ipAddress: string;
    reason: string | null;
    note: string | null;
    createdBy: string;
    isActive: boolean;
}

export interface HighlightedIPCreationAttributes extends Omit<HighlightedIPAttributes, "id"> {}

export class HighlightedIP extends Model<HighlightedIPAttributes, HighlightedIPCreationAttributes> implements HighlightedIPAttributes {
    public id!: number;
    public ipAddress!: string;
    public reason!: string | null;
    public note!: string | null;
    public createdBy!: string;
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

HighlightedIP.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ipAddress: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
            field: "ip_address",
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "created_by",
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: "is_active",
        },
    },
    {
        sequelize,
        tableName: "highlighted_ips",
        timestamps: true,
        underscored: true,
    },
);
