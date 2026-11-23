const ManajerKostDB = {
    init() {
        if (!localStorage.getItem('mk_initialized')) {
            const defaultUsers = [
                {
                    id: 1,
                    name: 'Budi Santoso',
                    email: 'owner@manajerkost.com',
                    phone: '081234567890',
                    role: 'owner',
                    password: 'password'
                },
                {
                    id: 2,
                    name: 'Siti Aminah',
                    email: 'user@manajerkost.com',
                    phone: '089876543210',
                    role: 'user',
                    password: 'password'
                }
            ];

            const defaultKosts = [
                {
                    id: 1,
                    user_id: 1,
                    name: 'Kost Griya Melati',
                    slug: 'kost-griya-melati',
                    description: 'Kamar luas ukuran 4x4m, AC, WiFi kencang 100 Mbps, kamar mandi dalam dengan water heater, parkir motor luas dan aman dengan CCTV 24 jam.',
                    price: 1500000,
                    location: 'Tembalang, Semarang',
                    address: 'Jl. Banjarsari Selatan No. 18, Tembalang, Kota Semarang',
                    contact_phone: '081234567890',
                    image: '',
                    is_available: true,
                    total_rooms: 12,
                    occupied_rooms: 8,
                    announcement: 'Mohon menjaga kebersihan dapur bersama dan mematikan lampu saat keluar kamar.',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    user_id: 1,
                    name: 'Kost Putra Harmoni',
                    slug: 'kost-putra-harmoni',
                    description: 'Dekat area kampus dan pusat kuliner. Termasuk listrik, kasur springbed, lemari pakaian, meja belajar, serta akses pintu 24 jam.',
                    price: 1100000,
                    location: 'Sekaran, Semarang',
                    address: 'Jl. Taman Siswa No. 45, Sekaran, Gunungpati, Semarang',
                    contact_phone: '081234567890',
                    image: '',
                    is_available: true,
                    total_rooms: 10,
                    occupied_rooms: 6,
                    announcement: 'Pembayaran sewa maksimal tanggal 5 setiap bulannya.',
                    created_at: new Date().toISOString()
                },
                {
                    id: 3,
                    user_id: 1,
                    name: 'Kost Eksekutif Anggrek',
                    slug: 'kost-eksekutif-anggrek',
                    description: 'Hunian nyaman dan tenang untuk mahasiswa maupun karyawan. Full furnished, Smart TV, AC, dapur bersama lengkap, dan layanan laundry.',
                    price: 2200000,
                    location: 'Banyumanik, Semarang',
                    address: 'Jl. Setiabudi No. 102, Banyumanik, Kota Semarang',
                    contact_phone: '081234567890',
                    image: '',
                    is_available: true,
                    total_rooms: 8,
                    occupied_rooms: 5,
                    announcement: 'Tamu menginap wajib melapor kepada penjaga kost.',
                    created_at: new Date().toISOString()
                }
            ];

            const defaultRequests = [
                {
                    id: 1,
                    kost_id: 1,
                    user_id: 2,
                    status: 'pending',
                    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
                }
            ];

            const defaultReports = [
                {
                    id: 1,
                    kost_id: 1,
                    user_id: 2,
                    title: 'WiFi Lantai 2 Lambat',
                    description: 'Koneksi WiFi di kamar lantai 2 sering putus-putus sejak kemarin sore.',
                    status: 'pending',
                    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
                }
            ];

            localStorage.setItem('mk_users', JSON.stringify(defaultUsers));
            localStorage.setItem('mk_kosts', JSON.stringify(defaultKosts));
            localStorage.setItem('mk_requests', JSON.stringify(defaultRequests));
            localStorage.setItem('mk_reports', JSON.stringify(defaultReports));
            localStorage.setItem('mk_initialized', 'true');
        }
    },

    getUsers() {
        return JSON.parse(localStorage.getItem('mk_users') || '[]');
    },
    saveUsers(users) {
        localStorage.setItem('mk_users', JSON.stringify(users));
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('mk_current_user') || 'null');
    },
    setCurrentUser(user) {
        if (user) {
            localStorage.setItem('mk_current_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('mk_current_user');
        }
    },

    getKosts() {
        return JSON.parse(localStorage.getItem('mk_kosts') || '[]');
    },
    saveKosts(kosts) {
        try {
            localStorage.setItem('mk_kosts', JSON.stringify(kosts));
            return true;
        } catch (e) {
            alert('Penyimpanan browser penuh. Gunakan foto dengan ukuran lebih kecil.');
            return false;
        }
    },
    deleteKost(kostId) {
        const updatedKosts = this.getKosts().filter(k => k.id !== kostId);
        this.saveKosts(updatedKosts);

        const updatedRequests = this.getRequests().filter(r => r.kost_id !== kostId);
        this.saveRequests(updatedRequests);

        const updatedReports = this.getReports().filter(r => r.kost_id !== kostId);
        this.saveReports(updatedReports);
    },

    getRequests() {
        return JSON.parse(localStorage.getItem('mk_requests') || '[]');
    },
    saveRequests(reqs) {
        localStorage.setItem('mk_requests', JSON.stringify(reqs));
    },

    getReports() {
        return JSON.parse(localStorage.getItem('mk_reports') || '[]');
    },
    saveReports(reports) {
        localStorage.setItem('mk_reports', JSON.stringify(reports));
    },

    formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID').format(angka);
    },

    formatWaNumber(phone) {
        if (!phone) return '';
        const cleaned = String(phone).replace(/[^0-9]/g, '');
        if (cleaned.startsWith('0')) {
            return '62' + cleaned.slice(1);
        }
        return cleaned;
    },

    timeAgo(dateString) {
        const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
        return `${Math.floor(diff / 86400)} hari yang lalu`;
    },

    slugify(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
    },

    compressImage(file, maxWidth = 800, quality = 0.75) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = reject;
                img.src = event.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    logout() {
        this.setCurrentUser(null);
        window.location.href = 'index.html';
    },

    renderNavbar() {
        const navContainer = document.getElementById('navbar-links');
        if (!navContainer) return;

        const user = this.getCurrentUser();
        if (user) {
            const firstName = user.name.split(' ')[0];
            const initial = user.name.charAt(0).toUpperCase();
            const roleLabel = user.role === 'owner' ? 'Pemilik Kos' : 'Penghuni Kos';

            navContainer.innerHTML = `
                <a href="index.html" class="text-sm font-medium text-gray-600 hover:text-primary transition">Beranda</a>
                ${user.role === 'owner' ? `<a href="owner-dashboard.html" class="text-sm font-medium text-gray-600 hover:text-primary transition">Dashboard Saya</a>` : ''}
                <a href="lapor.html" class="text-sm font-medium text-gray-600 hover:text-primary transition">Lapor Masalah</a>
                
                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open" @click.outside="open = false" class="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-primary transition focus:outline-none">
                        <div class="text-right hidden md:block">
                            <span class="block leading-none">Halo, ${firstName}</span>
                            <span class="text-[10px] text-gray-400 font-normal uppercase tracking-wider">${roleLabel}</span>
                        </div>
                        <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
                            ${initial}
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 transition-transform duration-200" :class="open ? 'rotate-180' : ''"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </button>

                    <div x-show="open" x-cloak class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden z-50">
                        <div class="px-4 py-3 border-b border-gray-50 bg-orange-50/50">
                            <p class="text-xs text-gray-500 uppercase tracking-wider font-bold mb-0.5">Status Akun</p>
                            <p class="text-sm font-bold text-primary">${roleLabel}</p>
                        </div>

                        <div class="py-1">
                            ${user.role === 'owner' ? `
                                <a href="owner-dashboard.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary">Dashboard Pemilik</a>
                                <a href="owner-create.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary">Tambah Kost Baru</a>
                            ` : ''}
                            <a href="lapor.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-primary">Lapor Masalah</a>
                        </div>

                        <div class="border-t border-gray-100 my-1"></div>
                        <button type="button" onclick="ManajerKostDB.logout()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                            Keluar
                        </button>
                    </div>
                </div>
            `;
        } else {
            navContainer.innerHTML = `
                <a href="index.html" class="text-sm font-medium text-gray-600 hover:text-primary transition">Beranda</a>
                <div class="flex items-center gap-3">
                    <a href="login.html" class="text-sm font-semibold text-gray-700 hover:text-primary transition">Masuk</a>
                    <a href="register.html" class="px-5 py-2.5 text-sm font-bold bg-gray-900 text-white rounded-full hover:bg-primary transition shadow-lg shadow-orange-500/20">Daftar</a>
                </div>
            `;
        }
    }
};

ManajerKostDB.init();