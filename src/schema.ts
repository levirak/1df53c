export type ActionBlueprintComponentType = 'form' | 'branch' | 'trigger' | 'configuration';

export type ActionBlueprintComponent = {
    id: string,
    component_key: string,
    component_type: ActionBlueprintComponentType,
    component_id: string,
    name: string,
    prerequisites: string[] | null,
    permitted_roles: string[] | null,
    input_mapping: unknown,
    approval_required: boolean,
    approval_roles: string[] | null,

    // TODO(levirak): more possibilities here.
};

export type ActionBlueprintGraphNode = {
    id: string,
    position: { x: number, y: number },
    type: ActionBlueprintComponentType,
    data: ActionBlueprintComponent,
};

export type ActionBlueprintGraphEdge = {
    source: string,
    target: string,
};

export type DynamicFieldConfigInput = {
    payload_fields: {
        [key: string]: {
            // tagged union
            type: "form_field",
            // ...
        }
    },
    endpoint_id: string,
    selector_field?: string,
    output_key?: string,
};

export type JsonSchema = {
    type: string,
    required: string[] | null,
    properties: object,
    additionalProperties: object,
};

export type ActionForm = { // TODO(levirak): type or interface?
    id: string,
    name: string,
    description: string,
    is_reusable: boolean,

    // inline version of what '$schema' props link to
    // describes what data the form contains?
    field_schema: JsonSchema,

    dynamic_field_config: {
        [key: string]: DynamicFieldConfigInput,
    },

    created_by: string,
    created_at: string,
    updated_at: string,
};

export type ActionBlueprintGraph = {
    nodes: ActionBlueprintGraphNode[] | null,
    edges: ActionBlueprintGraphEdge[] | null,
    forms: ActionForm[] | null
};
