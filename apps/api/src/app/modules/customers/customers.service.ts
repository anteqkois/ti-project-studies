import { Customer, Id, UpdateCustomerInput } from '@project/shared';
import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import { Database } from '../storage/database';
import { DatabaseCollection } from '../storage/mongoCollections';

@injectable()
export class CustomerService {
  constructor(
    @inject(Database)
    private readonly database: Database
  ) {}

  async getOne(id: Id): Promise<Customer | null> {
    const customer = await this.database.db
      .collection<Customer>(DatabaseCollection.customers)
      .findOne({ _id: id });
    
    if (!customer) return null;

    // Remove password from response
    const { password, ...customerWithoutPassword } = customer;
    return customerWithoutPassword as Customer;
  }

  async updateSettings(id: Id, updateData: UpdateCustomerInput): Promise<Customer | null> {
    const updateFields: Partial<Customer> = {};

    // Handle name update
    if (updateData.name !== undefined) {
      if (updateData.name.trim()) {
        // Check if name is already taken by another user
        const existingCustomer = await this.database.db
          .collection<Customer>(DatabaseCollection.customers)
          .findOne({
            name: updateData.name.trim(),
            _id: { $ne: id },
          });

        if (existingCustomer) {
          throw new Error('Name is already taken');
        }
        updateFields.name = updateData.name.trim();
      } else {
        // Allow empty name (optional field)
        updateFields.name = undefined;
      }
    }

    // Handle email update
    if (updateData.email !== undefined) {
      if (!updateData.email.trim()) {
        throw new Error('Email is required');
      }

      // Check if email is already taken by another user
      const existingCustomer = await this.database.db
        .collection<Customer>(DatabaseCollection.customers)
        .findOne({
          email: updateData.email.trim(),
          _id: { $ne: id },
        });

      if (existingCustomer) {
        throw new Error('Email is already taken');
      }
      
      updateFields.email = updateData.email.trim();
      updateFields.email_verified_datetime = null; // Reset email verification
    }

    // Handle settings update
    if (updateData.settings !== undefined) {
      updateFields.settings = { ...updateData.settings };
    }

    if (Object.keys(updateFields).length === 0) {
      // No fields to update, return current customer
      return await this.getOne(id);
    }

    const result = await this.database.db
      .collection<Customer>(DatabaseCollection.customers)
      .findOneAndUpdate(
        { _id: id },
        { $set: updateFields },
        { returnDocument: 'after' }
      );

    if (!result) return null;

    // Remove password from response
    const { password, ...customerWithoutPassword } = result;
    return customerWithoutPassword as Customer;
  }

  async changePassword(id: Id, currentPassword: string, newPassword: string): Promise<void> {
    // Get customer with password
    const customer = await this.database.db
      .collection<Customer>(DatabaseCollection.customers)
      .findOne({ _id: id });

    if (!customer) {
      throw new Error('Customer not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, customer.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.database.db
      .collection<Customer>(DatabaseCollection.customers)
      .updateOne(
        { _id: id },
        { $set: { password: newPasswordHash } }
      );
  }

  async deleteAccount(id: Id): Promise<boolean> {
    // Delete customer's notes first
    await this.database.db
      .collection(DatabaseCollection.notes)
      .deleteMany({ customerId: id });

    // Delete customer
    const result = await this.database.db
      .collection<Customer>(DatabaseCollection.customers)
      .deleteOne({ _id: id });

    return result.deletedCount > 0;
  }
}