
import { Controller, Get, Param } from '@nestjs/common';
import { InfuraService } from './app.service';

@Controller('infura')
export class InfuraController {
  constructor(private readonly infuraService: InfuraService) { }

  @Get('balance/:network/:address')
  async getBalance(@Param('address') address: string): Promise<string> {
    return this.infuraService.getBalance(address);
  }

  @Get('ERC20balance/:network/:address/:tokenContractAddress')
  async getERC20Balance(@Param('address') address: string, @Param('tokenContractAddress') tokenContractAddress: string): Promise<string> {
    return this.infuraService.getERC20Balance(tokenContractAddress, address);
  }

  @Get('ERC721balance/:network/:address/:tokenContractAddress')
  async getERC721Balance(@Param('address') address: string, @Param('tokenContractAddress') tokenContractAddress: string): Promise<string> {
    return this.infuraService.getERC721Balance(tokenContractAddress, address);
  }

  @Get('userdepositednft/:address')
  async getIfUserDepositedNFT(@Param('address') address: string): Promise<boolean> {
    return this.infuraService.getIfUserDepositedNFT(address);
  }

  @Get('userownsnft/:address')
  async getIfUserOwnsNFT(@Param('address') address: string): Promise<boolean> {
    return this.infuraService.getIfUserOwnsNFT(address);
  }

  @Get('availablenfts')
  async getAvailableNfts(): Promise<number> {
    return this.infuraService.getAvailableNfts();
  }

  @Get('hasERC20allowance/:owner/:sender')
  async getHasERC20Allowance(@Param('owner') owner: string, @Param('sender') sender: string): Promise<boolean> {
    return this.infuraService.getHasERC20Allowance(owner, sender);
  }

  @Get('hasERC721allowance/:owner')
  async getHasERC721Allowance(@Param('owner') owner: string): Promise<boolean> {
    return this.infuraService.getHasERC721Allowance(owner);
  }

}