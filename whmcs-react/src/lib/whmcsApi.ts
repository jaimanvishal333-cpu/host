import axios from 'axios';
import type { AxiosInstance } from 'axios';

type WhmcsApiParams = Record<string, string | number | boolean | undefined>;

const baseURL = import.meta.env.VITE_WHMCS_API_URL as string;
const apiIdentifier = import.meta.env.VITE_WHMCS_API_IDENTIFIER as string;
const apiSecret = import.meta.env.VITE_WHMCS_API_SECRET as string;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.warn('VITE_WHMCS_API_URL is not set');
}

const client: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  withCredentials: true,
});

function toFormData(params: WhmcsApiParams): URLSearchParams {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    search.append(key, String(value));
  });
  return search;
}

export async function callWhmcsApi<T = any>(action: string, params: WhmcsApiParams = {}): Promise<T> {
  const payload: WhmcsApiParams = {
    action,
    responsetype: 'json',
    identifier: apiIdentifier,
    secret: apiSecret,
    ...params,
  };
  const data = toFormData(payload);
  const response = await client.post('', data);
  if (response.data?.result && response.data.result !== 'success') {
    const message = response.data.message || 'WHMCS API error';
    throw new Error(message);
  }
  return response.data as T;
}

export type LoginResponse = {
  result: string;
  message?: string;
  userid?: number;
  user_id?: number;
  contactid?: number;
  twofactorenabled?: boolean | string;
};

export const whmcsApi = {
  validateLogin: (email: string, password: string) =>
    callWhmcsApi<LoginResponse>('ValidateLogin', { email, password }),
  addClient: (params: WhmcsApiParams) => callWhmcsApi('AddClient', params),
  sendEmail: (params: WhmcsApiParams) => callWhmcsApi('SendEmail', params),
  getClientsDetails: (clientid: number) => callWhmcsApi('GetClientsDetails', { clientid, stats: true }),
  getClientsProducts: (clientid: number) => callWhmcsApi('GetClientsProducts', { clientid }),
  getInvoices: (userid: number) => callWhmcsApi('GetInvoices', { userid }),
  getSupportTickets: (clientid: number) => callWhmcsApi('GetSupportTickets', { clientid }),
  openTicket: (params: WhmcsApiParams) => callWhmcsApi('OpenTicket', params),
  getClientsDomains: (clientid: number) => callWhmcsApi('GetClientsDomains', { clientid }),
  getProducts: (gid?: number) => callWhmcsApi('GetProducts', gid ? { gid } : {}),
  addOrder: (params: WhmcsApiParams) => callWhmcsApi('AddOrder', params),
  domainWhois: (domain: string) => callWhmcsApi('DomainWhois', { domain }),
  updateClient: (clientid: number, updates: WhmcsApiParams) => callWhmcsApi('UpdateClient', { clientid, ...updates }),
};

export function buildInvoiceUrl(invoiceId: number | string): string {
  const base = import.meta.env.VITE_WHMCS_CLIENT_AREA_BASE as string;
  return `${base.replace(/\/$/, '')}/viewinvoice.php?id=${invoiceId}`;
}

