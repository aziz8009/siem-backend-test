import { AlertService } from "../../../src/services/alert.service";
import { AlertRepository } from "../../../src/repositories/alert.repository";
import { AssetRepository } from "../../../src/repositories/asset.repository";

jest.mock("../../../src/repositories/alert.repository");
jest.mock("../../../src/repositories/asset.repository");

describe("AlertService", () => {
    let alertService: AlertService;
    let alertRepository: jest.Mocked<AlertRepository>;
    let assetRepository: jest.Mocked<AssetRepository>;

    beforeEach(() => {
        alertRepository = new AlertRepository() as jest.Mocked<AlertRepository>;
        assetRepository = new AssetRepository() as jest.Mocked<AssetRepository>;
        alertService = new AlertService(alertRepository, assetRepository);
    });

    describe("getFilteredAlerts", () => {
        it("should return empty data when no assets found", async () => {
            assetRepository.findAssetsByFilters.mockResolvedValue([]);

            const result = await alertService.getFilteredAlerts({
                department: "Finance",
                page: 1,
                limit: 20,
            });

            expect(result.data).toEqual([]);
            expect(result.total).toBe(0);
        });

        it("should return alerts when assets found", async () => {
            const mockAssets = [{ hostIdentifierLocal: "192.168.1.1" }, { hostIdentifierLocal: "192.168.1.2" }];
            const mockAlerts = {
                total: 2,
                hits: [
                    {
                        timestamp: "2026-06-01T10:01:00Z",
                        src_ip: "185.220.101.5",
                        network_target_ip: "192.168.1.1",
                        signature_name: "Test Alert",
                        severity: 1,
                    },
                ],
            };

            assetRepository.findAssetsByFilters.mockResolvedValue(mockAssets as any);
            alertRepository.findAlertsByTargetIPs.mockResolvedValue(mockAlerts);

            const result = await alertService.getFilteredAlerts({
                department: "Finance",
                page: 1,
                limit: 20,
            });

            expect(result.data).toHaveLength(1);
            expect(result.total).toBe(2);
        });
    });
});
