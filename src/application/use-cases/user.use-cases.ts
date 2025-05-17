import { UsuarioRepository } from '../../core/ports/repositories/usuario.repository';
import { UpdateUserDto ,CreateUserDto,Usuario} from '../../core/entities/user.dto';
import { AuthService } from '../../core/ports/services/auth.service';



export class UserUseCases {
  constructor(private readonly usuarioRepository: UsuarioRepository,
     private readonly authService: AuthService
  ) {}

  async getUserProfile(userId: number) {
    return this.usuarioRepository.findById(userId);
  }

  async updateUser(userId: number, updateData: UpdateUserDto) {
    return this.usuarioRepository.update(userId, updateData);
  }
  async listUsers() {
    return this.usuarioRepository.findAll();
  }
  async createUser(userData: CreateUserDto): Promise<Usuario> {

    const existingUser = await this.usuarioRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    const hashedPassword = await this.authService.hashPassword(userData.password);
    const newUser = await this.usuarioRepository.create({
      ...userData,
      password: hashedPassword,
      estado: 'activo'
    });
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as Usuario;
  }

}