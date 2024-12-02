class Dragonfly {
    constructor(cities) {
        this.cities = cities;
        this.population = [];
        this.bestPath = [];
        this.bestFitness = Infinity;
        this.initPopulation();
    }

    // Inisialisasi populasi dragonfly
    initPopulation() {
        for (let i = 0; i < 10; i++) {
            const path = this.generateRandomPath();
            const fitness = this.calculateFitness(path);
            this.population.push({ path, fitness });
            if (fitness < this.bestFitness) {
                this.bestFitness = fitness;
                this.bestPath = path;
            }
        }
    }

    // Generate jalur acak
    generateRandomPath() {
        const unvisited = this.cities.filter(city => city.name !== 'Bandung');
        const path = ['Bandung'];
        while (unvisited.length > 0) {
            const nextCity = unvisited.splice(Math.floor(Math.random() * unvisited.length), 1)[0];
            path.push(nextCity.name);
        }
        path.push('Bandung'); // Tambahkan Bandung sebagai kota terakhir
        return path;
    }

    // Hitung fitness (jarak total)
    calculateFitness(path) {
        let totalDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const city1 = this.cities.find(city => city.name === path[i]);
            const city2 = this.cities.find(city => city.name === path[i + 1]);
            totalDistance += this.calculateDistance(city1, city2);
        }
        return totalDistance;
    }

    // Hitung jarak antara dua kota
    calculateDistance(city1, city2) {
        const R = 6371; // Radius Bumi dalam kilometer
        const dLat = this.degToRad(city2.lat - city1.lat);
        const dLon = this.degToRad(city2.lon - city1.lon);
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(this.degToRad(city1.lat)) * Math.cos(this.degToRad(city2.lat)) *
                  Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    // Jalankan iterasi algoritma
    runIteration() {
        for (let i = 0; i < this.population.length; i++) {
            const newPath = this.mutatePath(this.population[i].path);
            const newFitness = this.calculateFitness(newPath);
            if (newFitness < this.population[i].fitness) {
                this.population[i] = { path: newPath, fitness: newFitness };
            }
            if (newFitness < this.bestFitness) {
                this.bestFitness = newFitness;
                this.bestPath = newPath;
            }
        }
    }

    // Mutasi jalur (swap dua kota)
    mutatePath(path) {
        const newPath = [...path];
        const i = Math.floor(Math.random() * (path.length - 2)) + 1; // Hindari indeks 0 dan terakhir
        const j = Math.floor(Math.random() * (path.length - 2)) + 1; // Hindari indeks 0 dan terakhir
        [newPath[i], newPath[j]] = [newPath[j], newPath[i]];
        return newPath;
    }
}

export { Dragonfly };
