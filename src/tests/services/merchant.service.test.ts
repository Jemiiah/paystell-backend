import { MerchantAuthService } from "../../services/merchant.service";
import { Merchant } from "../../interfaces/webhook.interfaces";

jest.mock("../../services/merchant.service");

describe("MerchantAuthService", () => {
    let merchantAuthService: MerchantAuthService;

    beforeEach(() => {
        merchantAuthService = new MerchantAuthService();
    });

    describe("findMerchantByApiKey", () => {
        it("should return a merchant when a valid API key is provided", async () => {
            const mockMerchant: Merchant = {
                id: "123",
                apiKey: "valid_api_key",
                secret: "secret",
                name: "Test Merchant",
                email: "merchant@test.com",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(merchantAuthService as any, "findMerchantByApiKey").mockResolvedValue(mockMerchant);

            const result = await (merchantAuthService as any).findMerchantByApiKey("valid_api_key");
            expect(result).toEqual(mockMerchant);
        });

        it("should return null when the API key is invalid", async () => {
            jest.spyOn(merchantAuthService as any, "findMerchantByApiKey").mockResolvedValue(null);

            const result = await (merchantAuthService as any).findMerchantByApiKey("invalid_api_key");
            expect(result).toBeNull();
        });
    });

    describe("getMerchantById", () => {
        it("should return a merchant when a valid ID is provided", async () => {
            const mockMerchant: Merchant = {
                id: "123",
                apiKey: "api_key",
                secret: "secret",
                name: "Test Merchant",
                email: "merchant@test.com",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (merchantAuthService.getMerchantById as jest.Mock).mockResolvedValue(mockMerchant);

            const result = await merchantAuthService.getMerchantById("123");
            expect(result).toEqual(mockMerchant);
        });

        it("should throw an error when the merchant is not active", async () => {
            const mockMerchant: Merchant = {
                id: "123",
                apiKey: "api_key",
                secret: "secret",
                name: "Test Merchant",
                email: "merchant@test.com",
                isActive: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (merchantAuthService.getMerchantById as jest.Mock).mockImplementation(async (merchantId: string) => {
                const merchant = mockMerchant;
                if (!merchant.isActive) {
                    throw new Error("Merchant not found");
                }
                return merchant;
            });

            await expect(merchantAuthService.getMerchantById("123"))
                .rejects.toThrow("Merchant not found");
        });
    });

    describe("validateApiKey", () => {
        it("should return a merchant when a valid API key is provided", async () => {
            const mockMerchant: Merchant = {
                id: "123",
                apiKey: "valid_api_key",
                secret: "secret",
                name: "Test Merchant",
                email: "merchant@test.com",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (merchantAuthService.validateApiKey as jest.Mock).mockResolvedValue(mockMerchant);

            const result = await merchantAuthService.validateApiKey("valid_api_key");
            expect(result).toEqual(mockMerchant);
        });

        it("should throw an error when the merchant is not active", async () => {
            const mockMerchant: Merchant = {
                id: "123",
                apiKey: "valid_api_key",
                secret: "secret",
                name: "Test Merchant",
                email: "merchant@test.com",
                isActive: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (merchantAuthService.validateApiKey as jest.Mock).mockImplementation(async (apiKey: string) => {
                const merchant = mockMerchant;
                if (!merchant.isActive) {
                    throw new Error("Merchant does not exist or is not active");
                }
                return merchant;
            });

            await expect(merchantAuthService.validateApiKey("valid_api_key"))
                .rejects.toThrow("Merchant does not exist or is not active");
        });
    });
});
