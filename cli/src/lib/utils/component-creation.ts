import type { CocosClient } from '../client.js';

export interface CreateComponentResult {
  component: string;
  success: boolean;
  error?: string;
}

const DEFAULT_SPRITE_FRAME_UUID = '7d8f9b89-4fd1-4c9f-a3ab-38ec7cded7ca@f9941';

async function setSpriteDefaultProperty(
  client: CocosClient,
  uuid: string
): Promise<void> {
  await client.execute(
    'scene',
    'set-property',
    [{
      uuid,
      component: 'cc.Sprite',
      properties: [
        {
          name: 'spriteFrame',
          value: { uuid: DEFAULT_SPRITE_FRAME_UUID },
          type: 'cc.SpriteFrame',
        },
      ],
    }]
  );
}

export async function createComponentForNode(
  client: CocosClient,
  uuid: string,
  component: string
): Promise<CreateComponentResult> {
  try {
    const result = await client.executeRaw(
      'scene',
      'create-component',
      [{ uuid, component }]
    );

    if (!result.success) {
      return {
        component,
        success: false,
        error: 'Failed to create component',
      };
    }

    if (component === 'cc.Sprite') {
      await setSpriteDefaultProperty(client, uuid);
    }

    return {
      component,
      success: true,
    };
  } catch (error) {
    return {
      component,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function createComponentsForNode(
  client: CocosClient,
  uuid: string,
  components: string[]
): Promise<CreateComponentResult[]> {
  const results: CreateComponentResult[] = [];

  for (const component of components) {
    const result = await createComponentForNode(client, uuid, component);
    results.push(result);
  }

  return results;
}
