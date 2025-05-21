import {
    Handle,
    Position,
    type NodeProps,
    type Node,
} from '@xyflow/react';
import { useCallback } from 'react';

import type { MouseEventHandler } from 'react';
import type { ActionBlueprintComponent } from './schema.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';

const typeLookup = {
    'form': 'Form',
    'branch': 'Branch',
    'trigger': 'Trigger',
    'configuration': 'Configuration',
} as const;

import './Node.css';


export interface FormNode extends Node {
    type: 'form',
    data: {
        nodeData: ActionBlueprintComponent,
        setModalNode: (id: string) => void;
    };
}

export function FormNode({ id, data }: NodeProps<FormNode>) {
    const node = data.nodeData;

    const onClick: MouseEventHandler<HTMLElement> = useCallback(event => {
        data.setModalNode(event.currentTarget.dataset.nodeId ?? '');
    }, [data]);

    return <>
        <Handle type='target' position={Position.Left} />
        <div className='form-node'>
            <div className='form-icon nodrag' onClick={onClick} data-node-id={id}>
                <FontAwesomeIcon icon={faFileInvoice} style={{ width: '25px', height: '25px' }} />
            </div>
            <div className='form-data'>
                <div className='form-type'>{typeLookup[node.component_type]}</div>
                <div className='form-name'>{String(node.name)}</div>
            </div>
        </div>
        <Handle type='source' position={Position.Right} />
    </>;
}
