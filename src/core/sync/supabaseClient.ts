export class SupabaseSyncClient {
  private url: string;
  private key: string;

  constructor(url: string, key: string) {
    this.url = url;
    this.key = key;
  }

  private getHeaders() {
    return {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  async testConnection() {
    try {
      // Just fetch an arbitrary non-existent table to check if auth works
      const res = await fetch(`${this.url}/rest/v1/store?limit=1`, {
        headers: this.getHeaders()
      });
      if (res.status === 401 || res.status === 403) {
        throw new Error('Xác thực thất bại. Vui lòng kiểm tra lại Anon Key.');
      }
      return true;
    } catch (e: any) {
      throw new Error(`Không thể kết nối đến Supabase: ${e.message}`);
    }
  }

  async pullState() {
    const res = await fetch(`${this.url}/rest/v1/store?select=*`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to pull from Supabase');
    const rows = await res.json();
    const data: Record<string, any> = {};
    rows.forEach((row: any) => {
      try {
        data[row.key] = JSON.parse(row.value);
      } catch (e) {
        data[row.key] = row.value;
      }
    });
    return data;
  }

  async pushState(payload: Record<string, any>) {
    // Upsert into Supabase `store` table
    const rows = Object.keys(payload).map(key => ({
      key,
      value: JSON.stringify(payload[key]),
      updated_at: new Date().toISOString()
    }));

    const res = await fetch(`${this.url}/rest/v1/store`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(rows)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to push to Supabase: ${errorText}`);
    }
    return true;
  }
}
