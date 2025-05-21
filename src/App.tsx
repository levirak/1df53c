import {
    useCallback,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

import {
    Background,
    ReactFlow,
    addEdge,
    useEdgesState,
    useNodesState,
    type Edge,
    type Node,
    type Connection,
} from '@xyflow/react';

import './App.css';
import '@xyflow/react/dist/style.css';

import type { ActionBlueprintGraph } from './schema.ts';
import { FormNodeModal } from './Modal.tsx';
import type { FormNode } from './Node.tsx';
import { nodeTypes } from './node-types.ts';
import {
    DatabaseImpl,
    DummyDb,
    type Database,
    type GlobalData,
    type MappingsDb,
} from './Database.tsx';


const FetchStatus = {
    PENDING: 'Pending',
    SUCCESS: 'Success',
    FAILURE: 'Failure',
} as const;
type FetchStatus = (typeof FetchStatus)[keyof typeof FetchStatus];

const actionBlueprintGraphUrl = 'http://localhost:3000/api/v1/{tenant_id}/actions/blueprints/{action_blueprint_id}/{blueprint_version_id}/graph';

const dummyGlobals = new Map<string, GlobalData>([
    ['global-fc0e64fd-f708-467b-b1d0-697504d2837a', {
        name: 'Global Data 1',
        data: {
            email: 'dummy@some-website.example',
            dynamic_object: { dummy_key: 'dummy value' },
            notes: [ 'note 1', 'note 1' ],
        }
    }],
    ['global-735b92ad-879f-4e4d-bc0b-3e9215dd6b48', {
        name: 'Global Data 2',
        data: {
            email: 'dummy@some-website.example',
            thing_1: 'thing_1',
            thing_2: { thing: 'thing' },
        }
    }],
]);

const dummyMappingDb: MappingsDb = {
    'form-a4750667-d774-40fb-9b0a-44f8539ff6c4': {
        'button': [ 'node', 'form-47c61d17-62b0-4c42-8ca2-0eff641c9d88', 'button' ],
    }
};

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const onConnectEdge = useCallback((params: Connection) => {
        setEdges((eds) => addEdge(params, eds));
    }, [setEdges]);

    const [db, setDb] = useState<Database>(new DummyDb());
    const [modalNode, setModalNode] = useState<string>('');

    const [status, setStatus] = useState<FetchStatus>(FetchStatus.PENDING);
    useEffect(() => {
        fetch(actionBlueprintGraphUrl).then(async response => {
            if (!response.ok) {
                setStatus(FetchStatus.FAILURE);
            } else {
                const graph = await response.json() as ActionBlueprintGraph;
                // TODO(levirak): validate response

                setDb(new DatabaseImpl(graph, dummyGlobals, dummyMappingDb));

                // NOTE: only form nodes are supported at the moment
                setNodes(graph.nodes?.filter(it => it.type === 'form').map(it => ({
                    id: it.id,
                    position: it.position,
                    type: 'form',
                    data: {
                        nodeData: it.data,
                        setModalNode: setModalNode,
                    },
                } satisfies FormNode)) ?? []);

                setEdges(graph.edges?.map(it => ({
                    id: `${it.source}-${it.target}`,
                    source: it.source,
                    target: it.target,
                })) ?? []);

                setStatus(FetchStatus.SUCCESS);
            }
        });
    }, [setEdges, setNodes]);


    let flowDiagram: ReactNode;
    switch (status) {
        case FetchStatus.PENDING:
            flowDiagram = <p>Please Wait.</p>;
            break;

        case FetchStatus.SUCCESS:
            flowDiagram = <ReactFlow
                nodes={nodes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                edges={edges}
                edgeTypes={{}}
                onEdgesChange={onEdgesChange}
                onConnect={onConnectEdge}
                fitView
                colorMode='dark'
            >
                <Background />
            </ReactFlow>;
            break;

        case FetchStatus.FAILURE:
            flowDiagram = <p>Failed to fetch the graph.</p>;
            break;

        default:
            flowDiagram = <p>An unknown error has occurred.</p>;
            break;
    }

    return <>
        <FormNodeModal nodeId={modalNode} db={db} onClose={() => setModalNode('')} />

        {/* UI elements can surround the graph while it's loading */}
        <div style={{ width: '100%', height: '750px' }}>
            {/* TODO(levirak): more dynamic size */}
            {flowDiagram}
        </div>
    </>;
}
