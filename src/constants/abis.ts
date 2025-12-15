export const MOCK_ERC20_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function balanceOf(address account) public view returns (uint256)",
] as const;

export const LAUNCHPAD_ABI = [
    "function contribute(uint256 poolId, uint256 amount, bytes32[] calldata proof) external payable",
    "function claim(uint256 poolId) external",
    "function getContribution(uint256 poolId, address user) external view returns (uint256)",
] as const;
