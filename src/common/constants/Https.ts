import type { MethodAction } from '@interfaces'

export const METHOD_ACTIONS: MethodAction[] = [
  {
    method: 'GET',
    action: 'read',
  },
  {
    method: 'POST',
    action: 'create',
  },
  {
    method: 'PUT',
    action: 'update',
  },
  {
    method: 'PATCH',
    action: 'update',
  },
  {
    method: 'DELETE',
    action: 'delete',
  },
]
