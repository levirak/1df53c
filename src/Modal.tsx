import {
    useCallback,
    useState,
    type ReactNode,
    type MouseEvent,
    type MouseEventHandler,
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronRight,
    faCircleXmark,
    faSquareXmark,
} from '@fortawesome/free-solid-svg-icons';

import './Modal.css';
import type { Database } from './Database.tsx';

function stopPropagation(event: MouseEvent) {
    event.stopPropagation();
};

export function BaseModal(param: {
    show?: boolean,
    onClose: () => void,
    title?: string,
    children?: ReactNode;
}) {
    const className = (param.show)
        ? 'modal-background'
        : 'modal-background display-none';

    const title = param.title ?? 'Modal';

    return <div className={className} onClick={param.onClose}>
        <div className='modal' onClick={stopPropagation}>
            <div className='modal-nav'>
                <span>{title}</span>
                <FontAwesomeIcon
                    icon={faSquareXmark}
                    size='xl'
                    style={{ float: 'right', }}
                    onClick={param.onClose}
                />
            </div>
            <div className='modal-body'>
                {param.children}
            </div>
        </div>
    </div>;
}

function BaseSelectable(param: {
    id: string,
    type: string,
    headline: string,
    onSelect: MouseEventHandler<HTMLElement>,
    children?: ReactNode,
}) {
    const [open, setOpen] = useState(false);

    return <div>
        <div onClick={() => { setOpen(!open); }}>
            <FontAwesomeIcon
                icon={open ? faChevronDown : faChevronRight}
                size='sm'
                style={{ width: '1rem' }}
            />
            {param.headline}
        </div>
        <div data-id={param.id} data-type={param.type} className={open ? '' : 'display-none'} style={{ paddingLeft: '2rem' }}>
            {param.children}
        </div>
    </div>;
}

function SelectableNodeFields(param: {
    id: string,
    graph: Database,
    onSelect: MouseEventHandler<HTMLElement>,
}) {
    const node = param.graph.getNode(param.id);
    if (node) {
        const form = param.graph.getForm(node.data.component_id);
        return form && <BaseSelectable
            id={param.id}
            type='node'
            headline={node.data.name}
            onSelect={param.onSelect}
        >
            {Object.keys(form.field_schema.properties).sort().map(it => {
                return <div data-field-name={it} onClick={param.onSelect}>
                    {it}
                </div>;
            })}
        </BaseSelectable>;
    }
}

function SelectableGlobalFields(param: {
    id: string,
    db: Database,
    onSelect: MouseEventHandler<HTMLElement>,
}) {
    const global = param.db.getGlobal(param.id);

    return <BaseSelectable
        id={param.id}
        type='global'
        headline={global?.name ?? '<UNKNOWN>'}
        onSelect={param.onSelect}
    >
        {Object.keys(global?.data ?? []).sort().map(it => {
            return <div data-field-name={it} onClick={param.onSelect}>
                {it}
            </div>;
        })}
    </BaseSelectable>;
}


/** Utility function for grabbing the name of a typed id */
function getName(db: Database, type: string, id: string) {
    let name;

    switch (type) {
        case 'node':
            name = db.getNode(id)?.data.name;
            break;

        case 'global':
            name = db.getGlobal(id)?.name;
            break;
    }

    return name ?? `<UNKNOWN ${type.toUpperCase()}>`;
}


export function FormNodeModal(param: {
    nodeId: string,
    db: Database,
    onClose: () => void,
}) {
    const { nodeId, db, onClose } = param;

    // TODO(levirak): look into better ways to signal a DB update.
    const [dbGeneration, setDbGeneration] = useState(0);

    const [selectedField, setSelectedField] = useState<string | undefined>(undefined);

    const onClickEmptyPrefill = useCallback((event: MouseEvent<HTMLElement>) => {
        const thisField = event.currentTarget.dataset.fieldName;
        if (selectedField !== thisField) {
            setSelectedField(thisField);
        } else {
            setSelectedField(undefined);
        }
    }, [selectedField]);

    const onClickMappedPrefill = useCallback((event: MouseEvent<HTMLElement>) => {
        const thisField = event.currentTarget.parentElement?.dataset.fieldName;
        if (thisField) {
            db.delMapping(nodeId, thisField);
            setDbGeneration(dbGeneration + 1);
        }
    }, [db, dbGeneration, nodeId]);

    const onSelect = useCallback((event: MouseEvent<HTMLElement>) => {
        if (selectedField) {
            const listItem = event.currentTarget;
            const listRoot = listItem.parentElement;

            if (listRoot) {
                const thisField = listItem.dataset.fieldName;
                const selectableId = listRoot.dataset.id;
                const selectableType = listRoot.dataset.type;

                if (thisField && selectableId && selectableType) {
                    db.setMapping(nodeId, selectedField, [
                        selectableType,
                        selectableId,
                        thisField,
                    ]);

                    setSelectedField(undefined);
                    setDbGeneration(dbGeneration + 1);
                }
            }
        }
    }, [db, dbGeneration, nodeId, selectedField]);

    const cleanClose = useCallback(() => {
        setSelectedField(undefined);
        onClose();
    }, [onClose]);

    const node = db.getNode(nodeId);
    const prereqs = db.getPrereqs(nodeId);
    const form = node && db.getForm(node.data.component_id);

    const show = !!(form && prereqs);
    return <BaseModal show={show} title={node?.data.name} onClose={cleanClose}>
        {show && <>
            <div className='prefill-map'>
                {Object.keys(form.dynamic_field_config).map(field => {
                    const mapping = db.getMapping(nodeId, field);
                    if (mapping) {
                        const [type, id, mappedField] = mapping;

                        return <div className='prefill filled' data-field-name={field}>
                            {field}: {getName(db, type, id)}.{mappedField}
                            <div onClick={onClickMappedPrefill} style={{ float: 'right' }}>
                                <FontAwesomeIcon icon={faCircleXmark} size='lg' />
                            </div>
                        </div>;
                    } else {
                        return <div
                            className={(selectedField === field) ? 'prefill selected' : 'prefill'}
                            data-field-name={field}
                            onClick={onClickEmptyPrefill}
                        >
                            {field}
                        </div>;
                    }
                })}
            </div>
            <div className={selectedField ? 'prefill-select' : 'prefill-select display-none'}>
                {db.listGlobals((globalId) => <SelectableGlobalFields
                    id={globalId}
                    db={db}
                    onSelect={onSelect}
                />)}
                {prereqs.map(prevId => <SelectableNodeFields
                    id={prevId}
                    graph={db}
                    onSelect={onSelect}
                />)}
            </div>
        </>}
    </BaseModal>;
}
