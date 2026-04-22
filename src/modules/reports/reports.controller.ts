import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { Roles } from '../../common/decorators';

@ApiTags('Reportes')
@ApiBearerAuth('JWT-auth')
@Roles('admin')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('revenue')
  @ApiOperation({ summary: 'Ingresos por rango de fechas (Admin)' })
  @ApiQuery({ name: 'from', example: '2026-01-01' })
  @ApiQuery({ name: 'to', example: '2026-12-31' })
  getRevenue(@Query('from') from: string, @Query('to') to: string) {
    return this.reportsService.getRevenue(from, to);
  }

  @Get('occupancy')
  @ApiOperation({ summary: 'Tasa de ocupación actual (Admin)' })
  getOccupancy() {
    return this.reportsService.getOccupancy();
  }

  @Get('payments')
  @ApiOperation({ summary: 'Listado de pagos (Admin)' })
  getPayments(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.reportsService.getPayments(+page, +limit);
  }
}
