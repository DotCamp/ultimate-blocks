import React from 'react';
import FrontendDataManager from '@Managers/FrontendDataManager';
import ProMenuContent from '@Components/SettingsMenu/ProMenuContent';

// use global hooks to intercept base version events
const { addFilter } = wp.hooks;

// initialize and fetch menu data
FrontendDataManager.init('ubProSettingsMenuData');
const { settingsMenuPageParam } = FrontendDataManager.getDataProperty('data');

// listen to settings menu route change event
addFilter(
	'ubSettingsMenuRouteMatched',
	'ubProSettingsMenuProIntercept',
	(routeContent, pageParam) => {
		if (pageParam === settingsMenuPageParam) {
			return <ProMenuContent />;
		}

		return routeContent;
	}
);
