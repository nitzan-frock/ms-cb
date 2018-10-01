import React from 'react';
import Resources from './Resources/resources';
import Machines from './Machines/machines';
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