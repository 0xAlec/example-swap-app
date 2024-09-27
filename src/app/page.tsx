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

function App() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [swappableTokens, setSwappableTokens] = useState<Token[]>([]);

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
      console.log('Got tokens', tokens);
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
              <Avatar className="h-6 w-6" />
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
                    setSwappableTokens([...swappableTokens, token]);
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
        <div className="flex justify-center">
          <Swap>
            <SwapAmountInput
              label="Sell"
              swappableTokens={swappableTokens}
              token={swappableTokens[0]}
              type="from"
            />
            <SwapToggleButton />
            <SwapAmountInput
              label="Buy"
              swappableTokens={swappableTokens}
              token={swappableTokens[0]}
              type="to"
            />
            <SwapButton />
            <SwapMessage />
            <SwapToast />
          </Swap>
        </div>
      </div>
    </>
  );
}

export default App;
