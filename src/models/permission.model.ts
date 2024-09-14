type Modules = 'security' | 'business' | 'products' | 'billing'

type Sections =
  // security
  | 'users'
  | 'roles'
  | 'permissions'
  // business
  | 'places'
  | 'providers'
  // products
  | 'foods'
  | 'complements'
  | 'extras'
  | 'drinks'
  | 'food_categories'
  // billing
  | 'taxes'
  | 'discounts'
  | 'promotions'
  | 'payment_methods'
  | 'orders'

export type Actions = 'read' | 'add' | 'edit' | 'delete'

interface ISection {
  section: Sections
  actions: Actions[]
}

export interface IModule {
  module: Modules
  sections: ISection[]
}

const ModuleModel: Modules[] = ['security', 'business', 'products', 'billing']
const SectionModel: Sections[] = [
  'users',
  'roles',
  'permissions',
  'places',
  'providers',
  'foods',
  'complements',
  'extras',
  'drinks',
  'food_categories',
  'taxes',
  'discounts',
  'promotions',
  'payment_methods',
  'orders',
]
const ActionModel: Actions[] = ['read', 'add', 'edit', 'delete']

const isValidIModule = (module: IModule) => {
  if (typeof module !== 'object' || !module) return false
  if (!ModuleModel.includes(module.module)) return false

  if (!Array.isArray(module.sections) || module.sections.length === 0)
    return false

  for (const section of module.sections) {
    if (typeof section !== 'object' || !section) return false
    if (!SectionModel.includes(section.section)) return false

    if (!Array.isArray(section.actions) || section.actions.length === 0)
      return false

    for (const action of section.actions) {
      if (!ActionModel.includes(action)) return false
    }
  }

  return true
}

export const isValidPermissionSchema = (permissions: IModule[]) => {
  if (!Array.isArray(permissions)) return false
  return permissions.every(isValidIModule)
}

export const PermissionModel: IModule[] = [
  {
    module: 'security',
    sections: [
      {
        section: 'users',
        actions: ['read', 'add', 'edit', 'delete'],
      },
      {
        section: 'roles',
        actions: ['read', 'add', 'edit', 'delete'],
      },
      {
        section: 'permissions',
        actions: ['read'],
      },
    ],
  },
  {
    module: 'business',
    sections: [
      {
        section: 'places',
        actions: ['read', 'add', 'edit', 'delete'],
      },
      {
        section: 'providers',
        actions: ['read', 'add', 'edit', 'delete'],
      },
    ],
  },
  {
    module: 'products',
    sections: [
      {
        section: 'foods',
        actions: ['read', 'add', 'edit', 'delete'],
      },
      {
        section: 'complements',
        actions: ['read', 'add', 'edit', 'delete'],
      },
      {
        section: 'extras',
        actions: ['read', 'add', 'edit', 'delete'],
      },
      {
        section: 'drinks',
        actions: ['read', 'add', 'edit', 'delete'],
      },
      {
        section: 'food_categories',
        actions: ['read', 'add', 'edit', 'delete'],
      },
    ],
  },
  {
    module: 'billing',
    sections: [
      {
        section: 'taxes',
        actions: ['read', 'add', 'edit', 'delete'],
      },
      {
        section: 'discounts',
        actions: ['read', 'add', 'edit', 'delete'],
      },
      {
        section: 'promotions',
        actions: ['read', 'add', 'edit', 'delete'],
      },
      {
        section: 'payment_methods',
        actions: ['read', 'add', 'edit', 'delete'],
      },
      {
        section: 'orders',
        actions: ['read', 'add', 'edit', 'delete'],
      },
    ],
  },
]
