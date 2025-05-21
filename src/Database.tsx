import type { ActionBlueprintGraph, ActionBlueprintGraphEdge, ActionBlueprintGraphNode, ActionForm } from './schema.ts';

export interface GlobalData {
    name: string,
    data: { [field: string]: unknown }, // TODO(levirak): should be a schema?
};

export type MappingTarget = [
    type: string,
    id: string,
    field: string,
];

export type MappingsDb = {
    [nodeId: string]: {
        [fieldId: string]: MappingTarget | undefined
    } | undefined
};

export interface Database {
    getNode(nodeId: string): ActionBlueprintGraphNode | undefined;

    getPrereqs(nodeId: string): string[] | undefined;

    getForm(formId: string): ActionForm | undefined;

    getGlobal(globalId: string): GlobalData | undefined;
    listGlobals(): string[];
    listGlobals<T>(mapFn: (id: string) => T, thisArg?: any): T[];

    getMapping(objId: string, objField: string): MappingTarget | undefined;
    setMapping(objId: string, objField: string, mapping: MappingTarget): void;
    delMapping(objId: string, objField: string): void;
};


function buildPrereqs_traverse(
    edges: { [nodeId: string]: string[] },
    thisId: string,
    workingSet: { [targetId: string]: boolean } = {},
) {
    for (const thatId of edges[thisId] ?? []) {
        if (workingSet[thatId]) continue;

        workingSet[thatId] = true;
        buildPrereqs_traverse(edges, thatId, workingSet);
    }

    return workingSet;
}

function buildPrereqs(edges: ActionBlueprintGraphEdge[]) {
    const oneLink: { [targetId: string]: string[] } = {};
    const nodeSet: { [targetId: string]: boolean } = {};

    for (const edge of edges) {
        oneLink[edge.target] ??= [];
        oneLink[edge.target].push(edge.source);

        nodeSet[edge.source] = true;
        nodeSet[edge.target] = true;
    }

    return new Map(Object.keys(nodeSet).map(nodeId => [
        nodeId,
        Object.keys(buildPrereqs_traverse(oneLink, nodeId)),
    ]));
}

export class DummyDb implements Database {
    getNode() { return undefined; };
    getPrereqs() { return undefined; };
    getForm() { return undefined; };

    getGlobal() { return undefined; };
    listGlobals() { return []; };

    getMapping() { return undefined; };
    setMapping() {};
    delMapping() {};
};

export class DatabaseImpl implements Database {
    #nodes: Map<string, ActionBlueprintGraphNode>;
    #forms: Map<string, ActionForm>;
    #prereqs: Map<string, string[]>;
    #globals: Map<string, GlobalData>;
    #mappings: { [nodeId: string]: { [fieldId: string]: [string, string, string] | undefined } | undefined };

    constructor(
        graph: ActionBlueprintGraph,
        globals: Map<string, GlobalData>,
        mappings: MappingsDb,
    ) {
        this.#nodes = new Map<string, ActionBlueprintGraphNode>();
        const nodes = graph.nodes ?? [];
        for (const node of nodes) {
            this.#nodes.set(node.id, node);
        }

        this.#forms = new Map<string, ActionForm>();
        const forms = graph.forms ?? [];
        for (const form of forms) {
            this.#forms.set(form.id, form);
        }

        this.#prereqs = buildPrereqs(graph.edges ?? []);
        this.#prereqs.forEach((prereqList) => {
            prereqList.sort((a, b) => {
                const aName = this.#nodes.get(a)!.data.name;
                const bName = this.#nodes.get(b)!.data.name;
                return aName.localeCompare(bName);
            });
        });

        this.#globals = globals;
        this.#mappings = mappings;
    }

    getNode(nodeId: string) { return this.#nodes.get(nodeId); }
    getPrereqs(nodeId: string) { return this.#prereqs.get(nodeId); }
    getForm(formId: string) { return this.#forms.get(formId); }

    getGlobal(globalId: string) {
        return this.#globals.get(globalId);
    }

    listGlobals<T>(mapFn?: (v: string, k: number) => T, thisArg?: any) {
        return !mapFn
            ? Array.from(this.#globals.keys())
            : Array.from(this.#globals.keys(), mapFn, thisArg);
    }

    getMapping(objId: string, objField: string) {
        return this.#mappings[objId]?.[objField];
    }

    setMapping(objId: string, objField: string, mapping: MappingTarget) {
        (this.#mappings[objId] ??= {})[objField] = mapping; // it's magic
    }

    delMapping(objId: string, objField: string) {
        delete this.#mappings[objId]?.[objField];
    }
};
