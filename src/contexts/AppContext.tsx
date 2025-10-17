import React from 'react';

import AppAccountContext from './AppAccountContext';
import AppCartContext from './AppCartContext';
import AppDynamicLinkContext from './AppDynamicLinkContext';
import AppFormRegisterContext from './AppFormRegisterContext';
import AppLoadingContext from './AppLoadingContext';
import AppModalToastContext from './AppModalToastContext';
import AppPaypalContext from './AppPaypalContext';
import AppPickAddressContext from './AppPickAddressContext';
import AppVideoPlayerContext from './AppVideoPlayerContext';

export const AppContext = ({ children }: { children: React.ReactNode }) => (
  <AppLoadingContext>
    <AppAccountContext>
      <AppModalToastContext>
        <AppPickAddressContext>
          <AppPaypalContext>
            <AppFormRegisterContext>
              <AppDynamicLinkContext>
                <AppVideoPlayerContext>
                  <AppCartContext>{children}</AppCartContext>
                </AppVideoPlayerContext>
              </AppDynamicLinkContext>
            </AppFormRegisterContext>
          </AppPaypalContext>
        </AppPickAddressContext>
      </AppModalToastContext>
    </AppAccountContext>
  </AppLoadingContext>
);
