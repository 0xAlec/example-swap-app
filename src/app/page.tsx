'use client';

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import { TokenRow, TokenSearch } from '@coinbase/onchainkit/token';
import { getTokens } from '@coinbase/onchainkit/api';
import { useCallback, useState } from 'react';
import type { Token } from '@coinbase/onchainkit/token';
import {
  Swap,
  SwapAmountInput,
  SwapToggleButton,
  SwapButton,
  SwapMessage,
  SwapToast,
} from '@coinbase/onchainkit/swap';

const ETH: Token = {
  address: '',
  chainId: 8453,
  decimals: 18,
  image:
    'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
  name: 'Ethereum',
  symbol: 'ETH',
};

const USDC: Token = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  chainId: 8453,
  decimals: 6,
  name: 'USDC',
  symbol: 'USDC',
  image:
    'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png',
};
function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [swappableToken, setSwappableToken] = useState<Token>();

  const handleChange = useCallback((value: string) => {
    // Clear tokens if the input is empty
    if (!value || value.trim() === '') {
      setTokens([]);
      return;
    }

    async function getData(value: any) {
      const resp = (await getTokens({
        search: value,
        limit: '5',
      })) as Token[];
      setTokens(resp);
    }
    getData(value);
  }, []);

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Wallet connection */}
        <div className="flex justify-end p-4">
          <Wallet>
            <ConnectWallet>
              <Avatar />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address className={color.foregroundMuted} />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>

        {/* Token search and list */}
        <div className="flex flex-col items-center w-1/2">
          <TokenSearch onChange={handleChange} delayMs={200} />
          {tokens.length > 0 && (
            <div className="mt-4 flex flex-col rounded-lg bg-white border border-gray-200 overflow-hidden">
              {tokens.map((token) => (
                <TokenRow
                  key={token.address}
                  token={token}
                  onClick={() => {
                    setSwappableToken(token);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-12" />
        <div className="h-12" />
        <div className="h-12" />

        {/* Swap */}
        {swappableToken && (
          <div className="flex justify-center">
            <Swap>
              <SwapAmountInput
                label="Sell"
                swappableTokens={[ETH]}
                token={ETH}
                type="from"
              />
              <SwapToggleButton />
              <SwapAmountInput
                label="Buy"
                swappableTokens={[swappableToken]}
                token={swappableToken}
                type="to"
              />
              <SwapButton />
              <SwapMessage />
              <SwapToast />
            </Swap>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
