import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export interface AssetAttributes {
    id: number;
    assetName: string;
    hostIdentifierLocal: string;
    departmentOwner: string;
    riskLevel: string;
}

export interface AssetCreationAttributes extends Omit<AssetAttributes, "id"> {}

export class Asset extends Model<AssetAttributes, AssetCreationAttributes> implements AssetAttributes {
    public id!: number;
    public assetName!: string;
    public hostIdentifierLocal!: string;
    public departmentOwner!: string;
    public riskLevel!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Asset.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assetName: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: "asset_name",
        },
        hostIdentifierLocal: {
            type: DataTypes.STRING(45),
            allowNull: false,
            field: "host_identifier_local",
        },
        departmentOwner: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "department_owner",
        },
        riskLevel: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "risk_level",
        },
    },
    {
        sequelize,
        tableName: "internal_infrastructure_assets",
        timestamps: false,
        underscored: true,
    },
);
