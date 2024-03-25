
import { Controller, Get, Param } from '@nestjs/common';
import { InfuraService } from './app.service';

@Controller('infura')
export class InfuraController {
  constructor(private readonly infuraService: InfuraService) { }

  @Get('balance/:network/:address')
  async getBalance(@Param('address') address: string, @Param('network') network: 'linea' | 'linea-goerli'): Promise<string> {
    return this.infuraService.getBalance(address, network);
  }

  @Get('ERC20balance/:network/:address/:tokenContractAddress')
  async getERC20Balance(@Param('address') address: string, @Param('network') network: 'linea' | 'linea-goerli', @Param('tokenContractAddress') tokenContractAddress: string): Promise<string> {
    return this.infuraService.getERC20Balance(tokenContractAddress, address, network);
  }

  @Get('ERC721balance/:network/:address/:tokenContractAddress')
  async getERC721Balance(@Param('address') address: string, @Param('network') network: 'linea' | 'linea-goerli', @Param('tokenContractAddress') tokenContractAddress: string): Promise<string> {
    return this.infuraService.getERC721Balance(tokenContractAddress, address, network);
  }
}