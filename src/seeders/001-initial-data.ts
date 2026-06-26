import { QueryInterface } from "sequelize";

export default {
    up: async (queryInterface: QueryInterface) => {
        // Check existing data
        const [results] = (await queryInterface.sequelize.query("SELECT COUNT(*) as count FROM internal_infrastructure_assets")) as any;

        if (results[0].count > 0) {
            console.log("Assets already exist, skipping seed...");
            return;
        }

        await queryInterface.bulkInsert("internal_infrastructure_assets", [
            {
                asset_name: "Server Core Finance",
                host_identifier_local: "192.168.10.25",
                department_owner: "Finance",
                risk_level: "High",
            },
            {
                asset_name: "Database HRIS",
                host_identifier_local: "192.168.10.30",
                department_owner: "HR",
                risk_level: "Medium",
            },
            {
                asset_name: "Web App Client Portal",
                host_identifier_local: "192.168.20.50",
                department_owner: "IT Operation",
                risk_level: "High",
            },
            {
                asset_name: "Workstation Admin",
                host_identifier_local: "192.168.50.11",
                department_owner: "Finance",
                risk_level: "Low",
            },
            {
                asset_name: "Fileserver R&D",
                host_identifier_local: "192.168.30.5",
                department_owner: "Research",
                risk_level: "Medium",
            },
        ]);

        // Seed highlighted IPs
        await queryInterface.bulkInsert("highlighted_ips", [
            {
                ip_address: "192.168.1.100",
                reason: "Suspicious activity detected - multiple failed login attempts",
                note: "Monitor this IP closely for potential brute force attacks",
                created_by: "security_analyst@company.com",
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                ip_address: "10.0.0.50",
                reason: "Known malicious source reported by threat intelligence",
                note: "Blocked at firewall level, monitoring for any bypass attempts",
                created_by: "security_analyst@company.com",
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                ip_address: "185.220.101.5",
                reason: "Repeat offender - multiple exploit attempts detected",
                note: "Active threat actor, coordinate with SOC team",
                created_by: "security_analyst@company.com",
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                ip_address: "45.95.168.2",
                reason: "Suspected botnet activity",
                note: "Increasing frequency of attacks from this source",
                created_by: "security_analyst@company.com",
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                ip_address: "192.168.1.200",
                reason: "False positive - internal misconfiguration",
                note: "Whitelisted, no longer monitored",
                created_by: "security_analyst@company.com",
                is_active: false,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        console.log("Seed data inserted successfully!");
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete("highlighted_ips", {});
        await queryInterface.bulkDelete("internal_infrastructure_assets", {});
    },
};
