const chainIds: { [key: number]: { name: string; symbol: string; network_key: string } } = {
	11155111: { name: "Sepolia", symbol: "SepoliaETH", network_key: "ETH_SEPOLIA" },
	80002: { name: "Amoy", symbol: "MATIC", network_key: "MATIC_AMOY" },
}

export default chainIds;