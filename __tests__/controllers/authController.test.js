jest.mock("../../services/authService.js", () => ({
  __esModule: true,
  default: {
    loginUser: jest.fn(),
    registerUser: jest.fn(),
    logoutUser: jest.fn(),
    findUser: jest.fn(),
    updateUserAvatar: jest.fn(),
  },
}));

import { loginUser } from "../../controllers/authController.js";
import authService from "../../services/authService.js";

describe("Auth Controller - loginUser", () => {
  const mockReq = (body = {}) => ({
    body: { email: "test@example.com", password: "password123", ...body },
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should respond with status code 200 on successful login", async () => {
    authService.loginUser.mockResolvedValue({
      token: "jwt-token",
      user: { email: "test@example.com", subscription: "starter", avatarURL: "https://example.com/avatar" },
    });
    const req = mockReq();
    const res = mockRes();

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return token in response", async () => {
    const token = "jwt-token-123";
    authService.loginUser.mockResolvedValue({
      token,
      user: { email: "test@example.com", subscription: "starter", avatarURL: null },
    });
    const req = mockReq();
    const res = mockRes();

    await loginUser(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token,
      })
    );
  });

  it("should return user object with email and subscription of type String", async () => {
    authService.loginUser.mockResolvedValue({
      token: "jwt-token",
      user: { email: "user@test.com", subscription: "pro", avatarURL: null },
    });
    const req = mockReq();
    const res = mockRes();

    await loginUser(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({
          email: "user@test.com",
          subscription: "pro",
        }),
      })
    );
    const callArg = res.json.mock.calls[0][0];
    expect(typeof callArg.user.email).toBe("string");
    expect(typeof callArg.user.subscription).toBe("string");
  });
});