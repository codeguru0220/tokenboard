import { ModalHeader } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { TallyHo } from "../../../static/icons/TallyHo"
import { WalletConnectIcon } from "../../../static/icons/WalletConect"
import InitialWalletSelection from "./InitialSelection"
import { FC, useState } from "react"
import ConnectMetamask from "./ConnectMetamask"
import withBaseModal from "../withBaseModal"
import ConnectWalletConnect from "./ConnectWalletConnect"
import { WalletType } from "../../../enums"
import { H5 } from "@threshold-network/components"
import { BaseModalProps, WalletOption } from "../../../types"
import ConnectCoinbase from "./ConnectCoinbase"
import { CoinbaseWallet } from "../../../static/icons/CoinbaseWallet"
import { useModal } from "../../../hooks/useModal"
import ModalCloseButton from "../ModalCloseButton"
import ConnectTallyHo from "./ConnectTallyHo"

const walletOptions: WalletOption[] = [
  {
    id: WalletType.TallyHo,
    title: "Tally Ho!",
    icon: TallyHo,
  },
  {
    id: WalletType.Metamask,
    title: "MetaMask",
    icon: MetaMaskIcon,
  },
  {
    id: WalletType.WalletConnect,
    title: "WalletConnect",
    icon: WalletConnectIcon,
  },
  {
    id: WalletType.Coinbase,
    title: "Coinbase Wallet",
    icon: CoinbaseWallet,
  },
]

const SelectWalletModal: FC<BaseModalProps> = () => {
  const { deactivate } = useWeb3React()
  const { closeModal } = useModal()

  const [walletToConnect, setWalletToConnect] = useState<WalletType | null>(
    null
  )

  const goBack = () => {
    deactivate()
    setWalletToConnect(null)
  }

  const onClick = async (walletType: WalletType) => {
    setWalletToConnect(walletType)
  }

  return (
    <>
      <ModalHeader>
        <H5>Connect a Wallet</H5>
      </ModalHeader>
      <ModalCloseButton />

      {walletToConnect === null ? (
        <InitialWalletSelection
          walletOptions={walletOptions}
          onSelect={onClick}
        />
      ) : (
        <ConnectWallet
          walletType={walletToConnect}
          goBack={goBack}
          onClose={closeModal}
        />
      )}
    </>
  )
}

const ConnectWallet: FC<{
  walletType: WalletType
  goBack: () => void
  onClose: () => void
}> = ({ walletType, goBack, onClose }) => {
  switch (walletType) {
    case WalletType.TallyHo:
      return <ConnectTallyHo goBack={goBack} closeModal={onClose} />
    case WalletType.Metamask:
      return <ConnectMetamask goBack={goBack} closeModal={onClose} />
    case WalletType.WalletConnect:
      return <ConnectWalletConnect goBack={goBack} closeModal={onClose} />
    case WalletType.Coinbase:
      return <ConnectCoinbase goBack={goBack} closeModal={onClose} />
    default:
      return <></>
  }
}

export default withBaseModal(SelectWalletModal)
