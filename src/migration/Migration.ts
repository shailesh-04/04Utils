/**
 * FieldDefinitions defines the schema fields and their SQL type parts.
 * @typedef {Object.<string, string[]>} FieldDefinitions
 *
 * @example
 * const fields = {
 *   id: ['SERIAL', 'PRIMARY KEY'],
 *   name: ['VARCHAR(255)', 'NOT NULL'],
 *   created_at: ['TIMESTAMP', 'DEFAULT CURRENT_TIMESTAMP']
 * };
 */

/**
 * QueryFunction is a function type to execute SQL queries.
 * @callback QueryFunction
 * @param {string} query - The SQL query string to execute.
 * @param {any[]} [params] - Optional parameters for parameterized queries.
 * @returns {Promise<any>} Promise resolving with query result.
 */

/**
 * Migration class for handling database schema migrations.
 * 
 * @param {string} table - The name of the table to migrate.
 * @param {FieldDefinitions} fieldDefinitions - Object describing field names and their SQL type arrays.
 * @param {QueryFunction} queryFn - Function to execute SQL queries.
 * @param {string[]} [constraints=[]] - Optional array of SQL constraints for the table.
 * 
 * @throws Will throw an error if SQL execution fails during migration operations.
 * 
 * @example
 * import {Migration} from '04-utils/migratoin';
 * 
 * const queryFn = async (query, params) => {
 *   // implementation to run query against DB, e.g. using pg or mysql client
 * };
 * 
 * const fields = {
 *   id: ['SERIAL', 'PRIMARY KEY'],
 *   username: ['VARCHAR(100)', 'NOT NULL'],
 *   email: ['VARCHAR(255)', 'UNIQUE', 'NOT NULL'],
 *   created_at: ['TIMESTAMP', 'DEFAULT CURRENT_TIMESTAMP']
 * };
 * 
 * const constraints = ['FOREIGN KEY (user_id) REFERENCES users(id)'];
 * 
 * const migration = new Migration('accounts', fields, queryFn, constraints);
 * 
 * await migration.createTable();
 * await migration.addColumn('last_login', ['TIMESTAMP', 'NULL']);
 * await migration.renameTable('user_accounts');
 * await migration.dropTable();
 */

type FieldDefinitions = {
    [fieldName: string]: string[];
};
type QueryFunction = (query: string, params?: any[]) => Promise<any>;
export class Migration {
    private table: string;
    private fields: { fieldName: string; type: string[] }[];
    private constraints: string[];
    private queryFn: QueryFunction;

    constructor(
        table: string,
        fieldDefinitions: FieldDefinitions,
        queryFn: QueryFunction,
        constraints: string[] = []
    ) {
        this.table = table;
        this.queryFn = queryFn;
        this.fields = Object.entries(fieldDefinitions).map(([fieldName, type]) => ({
            fieldName,
            type,
        }));
        this.constraints = constraints;
    }

    public async createTable(): Promise<void> {
        const fieldDefs = this.fields.map(
            (field) => `${field.fieldName} ${field.type.join(' ')}`
        );
        const allDefs = [...fieldDefs, ...this.constraints];
        const query = `CREATE TABLE ${this.table} (\n  ${allDefs.join(',\n  ')}\n);`;

        try {
            await this.queryFn(query);
            console.log("Successfully created table", this.table);
        } catch (error: any) {
            console.error("Failed to create table!");
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async dropTable(): Promise<void> {
        try {
            await this.queryFn(`DROP TABLE IF EXISTS ${this.table}`);
            console.log("Successfully dropped table", this.table);
        } catch (error: any) {
            console.error("Failed to drop table!");
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async truncateTable(): Promise<void> {
        try {
            await this.queryFn(`TRUNCATE TABLE ${this.table}`);
            console.log("Successfully truncated table", this.table);
        } catch (error: any) {
            console.error("Failed to truncate table!");
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async addColumn(fieldName: string, type: string[]): Promise<void> {
        try {
            await this.queryFn(
                `ALTER TABLE ${this.table} ADD COLUMN ${fieldName} ${type.join(' ')}`
            );
            console.log(`Successfully added column ${fieldName} to table ${this.table}`);
            this.fields.push({ fieldName, type });
        } catch (error: any) {
            console.error(`Failed to add column ${fieldName}`);
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async dropColumn(columnName: string): Promise<void> {
        try {
            await this.queryFn(
                `ALTER TABLE ${this.table} DROP COLUMN ${columnName}`
            );
            console.log(`Successfully dropped column ${columnName} from table ${this.table}`);
            this.fields = this.fields.filter(field => field.fieldName !== columnName);
        } catch (error: any) {
            console.error(`Failed to drop column ${columnName}`);
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async renameTable(newTableName: string): Promise<void> {
        try {
            await this.queryFn(
                `ALTER TABLE ${this.table} RENAME TO ${newTableName}`
            );
            this.table = newTableName;
            console.log(`Successfully renamed table to ${newTableName}`);
        } catch (error: any) {
            console.error(`Failed to rename table ${this.table}`);
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async tableExists(): Promise<boolean> {
        try {
            const result = await this.queryFn(
                `SELECT EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = '${this.table}'
                )`
            );
            return result.rows?.[0]?.exists ?? false;
        } catch (error: any) {
            console.error(`Failed to check if table ${this.table} exists`);
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async migrate(callback: (table: Migration) => Promise<void>): Promise<void> {
        try {
            await callback(this);
            console.log(`Migration for table ${this.table} completed successfully`);
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
    public async sql(query: string, params?: any[]): Promise<any[]> {
        try {
            const result = await this.queryFn(query, params);
            return result;
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
    public getFieldDefinitions(): FieldDefinitions {
        return this.fields.reduce((acc, field) => {
            acc[field.fieldName] = field.type;
            return acc;
        }, {} as FieldDefinitions);
    }
}
