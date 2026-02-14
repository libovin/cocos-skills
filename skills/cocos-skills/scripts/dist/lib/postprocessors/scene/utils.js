export async function createComponentForNode(client, uuid, component) {
    try {
        const result = await client.executeRaw('scene', 'create-component', [{ uuid, component }]);
        return {
            component,
            success: result.success,
        };
    }
    catch (error) {
        return {
            component,
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
export async function createComponentsForNode(client, uuid, components) {
    const results = [];
    for (const component of components) {
        const result = await createComponentForNode(client, uuid, component);
        results.push(result);
    }
    return results;
}
