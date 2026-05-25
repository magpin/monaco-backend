import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotelSettings } from './entities/hotel-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsData, SettingsResponse } from './types/settings-response.type';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(HotelSettings)
    private readonly settingsRepository: Repository<HotelSettings>,
  ) {}

  async getSettings(): Promise<SettingsResponse> {
    let settings = await this.settingsRepository.findOne({ where: {} });

    // Crear configuración por defecto si no existe (singleton)
    if (!settings) {
      settings = this.settingsRepository.create();
      settings = await this.settingsRepository.save(settings);
    }

    return { status: 200, message: 'Configuración obtenida exitosamente', data: this.mapToData(settings) };
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<SettingsResponse> {
    let settings = await this.settingsRepository.findOne({ where: {} });

    if (!settings) {
      settings = this.settingsRepository.create();
    }

    Object.assign(settings, dto);
    const saved = await this.settingsRepository.save(settings);

    return { status: 200, message: 'Configuración actualizada exitosamente', data: this.mapToData(saved) };
  }

  private mapToData(s: HotelSettings): SettingsData {
    return {
      id: s.id,
      hotelName: s.hotelName,
      nit: s.nit,
      address: s.address,
      phone: s.phone,
      email: s.email,
      website: s.website,
      description: s.description,
      timezone: s.timezone,
      language: s.language,
      currency: s.currency,
      checkInTime: s.checkInTime,
      checkOutTime: s.checkOutTime,
      allowCancellations: s.allowCancellations,
      cancellationHoursLimit: s.cancellationHoursLimit,
      autoConfirm: s.autoConfirm,
      taxRate: +s.taxRate,
      consumptionTaxRate: +s.consumptionTaxRate,
      enableCreditCard: s.enableCreditCard,
      enablePse: s.enablePse,
      enableCash: s.enableCash,
      updatedAt: s.updatedAt.toISOString(),
    };
  }
}
