'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './sanity/env';
import { schema } from './sanity/schemaTypes';
import { structure } from './sanity/structure';

export default defineConfig({
  basePath: '/studio',
  name: 'pd-blog-studio',
  title: 'PD-Blog CMS',
  projectId,
  dataset,
  schema,
  plugins: [
    deskTool(),
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
