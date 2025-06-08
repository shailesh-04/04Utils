// Migration.test.ts
import { Migration } from '../src/migration/Migration';

describe('Migration', () => {
  let mockQueryFn: jest.Mock;
  let migration: Migration;

  const tableName = 'test_table';
  const initialFields = {
    id: ['SERIAL', 'PRIMARY KEY'],
    name: ['VARCHAR(255)', 'NOT NULL'],
  };
  const constraints = ['FOREIGN KEY (user_id) REFERENCES users(id)'];

  beforeEach(() => {
    mockQueryFn = jest.fn().mockResolvedValue({ rows: [{ exists: true }] });
    migration = new Migration(tableName, initialFields, mockQueryFn, constraints);
  });

  describe('createTable', () => {
    it('should execute correct CREATE TABLE query', async () => {
      await migration.createTable();

      const expectedFields = Object.entries(initialFields)
        .map(([f, t]) => `${f} ${t.join(' ')}`)
        .join(',\n  ');
      const expectedQuery = `CREATE TABLE ${tableName} (\n  ${expectedFields},\n  ${constraints[0]}\n);`;

      expect(mockQueryFn).toHaveBeenCalledWith(expectedQuery);
    });

    it('should throw on query error', async () => {
      mockQueryFn.mockRejectedValue(new Error('fail'));
      await expect(migration.createTable()).rejects.toThrow('fail');
    });
  });

  describe('dropTable', () => {
    it('should execute DROP TABLE query', async () => {
      await migration.dropTable();
      expect(mockQueryFn).toHaveBeenCalledWith(`DROP TABLE IF EXISTS ${tableName}`);
    });

    it('should throw on query error', async () => {
      mockQueryFn.mockRejectedValue(new Error('fail drop'));
      await expect(migration.dropTable()).rejects.toThrow('fail drop');
    });
  });

  describe('truncateTable', () => {
    it('should execute TRUNCATE TABLE query', async () => {
      await migration.truncateTable();
      expect(mockQueryFn).toHaveBeenCalledWith(`TRUNCATE TABLE ${tableName}`);
    });

    it('should throw on query error', async () => {
      mockQueryFn.mockRejectedValue(new Error('fail truncate'));
      await expect(migration.truncateTable()).rejects.toThrow('fail truncate');
    });
  });

  describe('addColumn', () => {
    const newColumn = 'age';
    const newType = ['INT', 'DEFAULT 0'];

    it('should add a new column and update fields', async () => {
      await migration.addColumn(newColumn, newType);
      expect(mockQueryFn).toHaveBeenCalledWith(`ALTER TABLE ${tableName} ADD COLUMN ${newColumn} ${newType.join(' ')}`);
      const fields = migration.getFieldDefinitions();
      expect(fields[newColumn]).toEqual(newType);
    });

    it('should throw on query error', async () => {
      mockQueryFn.mockRejectedValue(new Error('fail add column'));
      await expect(migration.addColumn(newColumn, newType)).rejects.toThrow('fail add column');
    });
  });

  describe('dropColumn', () => {
    const columnToDrop = 'name';

    it('should drop a column and update fields', async () => {
      await migration.dropColumn(columnToDrop);
      expect(mockQueryFn).toHaveBeenCalledWith(`ALTER TABLE ${tableName} DROP COLUMN ${columnToDrop}`);
      const fields = migration.getFieldDefinitions();
      expect(fields[columnToDrop]).toBeUndefined();
    });

    it('should throw on query error', async () => {
      mockQueryFn.mockRejectedValue(new Error('fail drop column'));
      await expect(migration.dropColumn(columnToDrop)).rejects.toThrow('fail drop column');
    });
  });

  describe('renameTable', () => {
    const newTableName = 'new_test_table';

    it('should rename the table and update table property', async () => {
      await migration.renameTable(newTableName);
      expect(mockQueryFn).toHaveBeenCalledWith(`ALTER TABLE ${tableName} RENAME TO ${newTableName}`);
      expect((migration as any).table).toBe(newTableName);
    });

    it('should throw on query error', async () => {
      mockQueryFn.mockRejectedValue(new Error('fail rename'));
      await expect(migration.renameTable(newTableName)).rejects.toThrow('fail rename');
    });
  });

  describe('tableExists', () => {
    it('should return true if table exists', async () => {
      mockQueryFn.mockResolvedValue({ rows: [{ exists: true }] });
      const exists = await migration.tableExists();
      expect(exists).toBe(true);
    });

    it('should return false if table does not exist', async () => {
      mockQueryFn.mockResolvedValue({ rows: [{ exists: false }] });
      const exists = await migration.tableExists();
      expect(exists).toBe(false);
    });

    it('should throw on query error', async () => {
      mockQueryFn.mockRejectedValue(new Error('fail check exists'));
      await expect(migration.tableExists()).rejects.toThrow('fail check exists');
    });
  });

  describe('migrate', () => {
    it('should run migration callback successfully', async () => {
      const callback = jest.fn().mockResolvedValue(undefined);
      await migration.migrate(callback);
      expect(callback).toHaveBeenCalledWith(migration);
    });

    it('should throw if migration callback throws', async () => {
      const callback = jest.fn().mockRejectedValue(new Error('migration error'));
      await expect(migration.migrate(callback)).rejects.toThrow('migration error');
    });
  });

  describe('sql', () => {
    it('should execute arbitrary SQL and return result', async () => {
      const result = [{ id: 1 }];
      mockQueryFn.mockResolvedValue(result);
      const res = await migration.sql('SELECT * FROM test');
      expect(res).toBe(result);
    });

    it('should throw on query error', async () => {
      mockQueryFn.mockRejectedValue(new Error('fail sql'));
      await expect(migration.sql('SELECT * FROM test')).rejects.toThrow('fail sql');
    });
  });

  describe('getFieldDefinitions', () => {
    it('should return current field definitions', () => {
      const defs = migration.getFieldDefinitions();
      expect(defs).toEqual(initialFields);
    });
  });
});
