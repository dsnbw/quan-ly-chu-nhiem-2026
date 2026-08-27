export class CloudSyncClient {
  private mode: 'SUPABASE' | 'FIREBASE';
  private url: string; // Supabase Project URL or Firebase Database URL
  private key: string; // Supabase Anon Key or Firebase Database Secret

  constructor(mode: 'SUPABASE' | 'FIREBASE', url: string, key: string) {
    this.mode = mode;
    // Format Firebase URL
    if (mode === 'FIREBASE') {
      this.url = url.endsWith('/') ? url.slice(0, -1) : url;
    } else {
      this.url = url;
    }
    this.key = key;
  }

  async testConnection() {
    try {
      if (this.mode === 'SUPABASE') {
        const res = await fetch(`${this.url}/rest/v1/store?limit=1`, {
          headers: {
            'apikey': this.key,
            'Authorization': `Bearer ${this.key}`
          }
        });
        if (res.status === 401 || res.status === 403) throw new Error('Supabase Auth Failed');
        return true;
      } else {
        // Firebase RTDB test
        const res = await fetch(`${this.url}/store.json?auth=${this.key}&shallow=true`);
        if (res.status === 401 || res.status === 403) throw new Error('Firebase Auth Failed');
        return true;
      }
    } catch (e: any) {
      throw new Error(`Kết nối thất bại: ${e.message}`);
    }
  }

  async pullState() {
    if (this.mode === 'SUPABASE') {
      const res = await fetch(`${this.url}/rest/v1/store?select=*`, {
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json'
        }
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
    } else {
      // Firebase RTDB
      const res = await fetch(`${this.url}/store.json?auth=${this.key}`);
      if (!res.ok) throw new Error('Failed to pull from Firebase');
      const data = await res.json() || {};
      const parsedData: Record<string, any> = {};
      Object.keys(data).forEach(k => {
        try {
          parsedData[k] = typeof data[k] === 'string' ? JSON.parse(data[k]) : data[k];
        } catch (e) {
          parsedData[k] = data[k];
        }
      });
      return parsedData;
    }
  }

  async pushState(payload: Record<string, any>) {
    if (this.mode === 'SUPABASE') {
      const rows = Object.keys(payload).map(key => ({
        key,
        value: JSON.stringify(payload[key]),
        updated_at: new Date().toISOString()
      }));

      const res = await fetch(`${this.url}/rest/v1/store`, {
        method: 'POST',
        headers: {
          'apikey': this.key,
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(rows)
      });

      if (!res.ok) throw new Error(`Supabase push failed: ${await res.text()}`);
      return true;
    } else {
      // Firebase RTDB - PATCH to update specific keys
      const patchPayload: Record<string, string> = {};
      Object.keys(payload).forEach(k => {
        patchPayload[k] = JSON.stringify(payload[k]);
      });

      const res = await fetch(`${this.url}/store.json?auth=${this.key}`, {
        method: 'PATCH', // PATCH merges, PUT overwrites everything
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchPayload)
      });

      if (!res.ok) throw new Error(`Firebase push failed: ${await res.text()}`);
      return true;
    }
  }
}
