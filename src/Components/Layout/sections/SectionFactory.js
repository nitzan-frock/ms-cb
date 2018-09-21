import React from 'react';
import Resources from './resources/resources';
import Machines from './machines/machines';
import DataMonitor from './dataMonitor/dataMonitor';

class SectionFactory {
    static build (props) {
        switch (props.activeTab.toLowerCase()) {
            case 'resources':
                return <Resources />;
            case 'machines':
                return <Machines {...props} />;
            case 'data monitor':
                return <DataMonitor />;
            default:
                return undefined;
        }
    }
}

export default SectionFactory;