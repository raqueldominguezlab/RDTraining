import type { CollectionConfig } from 'payload'

// Registro de compras de productos de pago único. Sin overrides de `access`:
// el default de Payload exige un usuario autenticado para leer/escribir, así
// que solo el admin puede listar pedidos (nunca expuesto a clientes).
// Se crea/actualiza únicamente desde app/api/products/* vía la API local de
// Payload (que no aplica control de acceso), nunca desde el cliente.
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderId',
    defaultColumns: ['orderId', 'product', 'email', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'orderId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Número de pedido enviado a Redsys (Ds_Order)',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      required: true,
    },
    {
      name: 'amountCents',
      type: 'number',
      required: true,
      admin: {
        description: 'Importe en céntimos copiado del producto en el momento de la compra',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pendiente', value: 'pending' },
        { label: 'Pagado', value: 'paid' },
        { label: 'Fallido', value: 'failed' },
      ],
    },
    {
      name: 'downloadToken',
      type: 'text',
      unique: true,
    },
    {
      name: 'downloadExpiresAt',
      type: 'date',
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
    },
  ],
  timestamps: true,
}
