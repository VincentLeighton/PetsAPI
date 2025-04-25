import request from 'supertest';
import { app } from '../src/index';

describe('Pets API', () => {
  it('should retrieve the list of pets', async () => {
    const response = await request(app).get('/pets');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should create a new pet', async () => {
    const newPet = {
      petName: 'Max',
      owner: 'John',
      isFed: true,
    };

    const response = await request(app).post('/pets').send(newPet);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newPet);
  });

  it('should update the isFed status of a pet', async () => {
    const petId = '1'; // Assuming a pet with ID 1 exists
    const response = await request(app).patch(`/pets/${petId}`).send({ isFed: false });
    expect(response.status).toBe(200);
    expect(response.body.isFed).toBe(false);
  });

  it('should delete a pet', async () => {
    const petId = '1'; // Assuming a pet with ID 1 exists
    const response = await request(app).delete(`/pets/${petId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(petId);
  });
});