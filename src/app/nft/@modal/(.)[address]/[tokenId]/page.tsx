import NFTPage from "@/app/nft/[address]/[tokenId]/page";
import Modal from "@/components/modal";

export default async function Page(props: any) {
	return (
		<Modal>
			<NFTPage {...props} />
		</Modal>
	);
}

