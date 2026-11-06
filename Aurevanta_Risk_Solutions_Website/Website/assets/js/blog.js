/**
 * Shieldora Risk Solutions - Commercial Property Insurance Broker
 * Blog Filtering, Search & Dynamic Pagination Engine
 */

const BLOG_ARTICLES = [
  {
    id: 1,
    title: "Navigating Commercial Property Insurance in 2026: Escalating Replacement Costs and Climate Risk",
    slug: "blog-details.html",
    category: "Property Insurance",
    excerpt: "With inflation driving construction materials and labor costs up by 24%, commercial property owners must recalibrate their building valuations to avoid costly underinsurance penalties.",
    author: "Eleanor Vance, CPCU",
    authorRole: "Head of Property Underwriting",
    date: "Oct 08, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
    tags: ["Underwriting", "Valuation", "Replacement Cost"]
  },
  {
    id: 2,
    title: "The Anatomy of a Fast-Track Commercial Insurance Claim: Water Intrusion in High-Rises",
    slug: "blog-details-water-claim.html",
    category: "Claims",
    excerpt: "A burst riser pipe in a 40-story office tower can cause $500K in damage within 20 minutes. Here is the exact protocol our claims advocacy team deploys to secure prompt carrier payouts.",
    author: "Marcus Sterling",
    authorRole: "Senior Claims Advocate",
    date: "Sep 28, 2026",
    readTime: "5 min read",
    image: "https://plus.unsplash.com/premium_photo-1663045495725-89f23b57cfc5?auto=format&fit=crop&w=800&q=80",
    tags: ["Claims Management", "Water Damage", "Mitigation"]
  },
  {
    id: 3,
    title: "Business Interruption vs. Extra Expense: Demystifying Income Loss Protection",
    slug: "blog-details-business-interruption.html",
    category: "Business Protection",
    excerpt: "When physical property damage shuts down operations, standard property insurance rebuilds walls, but Business Interruption preserves your payroll, rent, and quarterly profits.",
    author: "David Chen, ARM",
    authorRole: "Risk Advisory Director",
    date: "Sep 15, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    tags: ["Business Interruption", "Cash Flow", "Revenue"]
  },
  {
    id: 4,
    title: "Warehouse & Logistics Hub Fire Protection: New Codes and Insurance Deductible Credits",
    slug: "blog-details-warehouse-fire.html",
    category: "Risk Management",
    excerpt: "Modern ESFR sprinkler systems and thermal AI monitoring are slashing warehouse property insurance premiums by up to 28% across major nationwide logistics corridors.",
    author: "David Chen, ARM",
    authorRole: "Risk Advisory & Engineering Director",
    date: "Aug 29, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
    tags: ["Industrial", "Fire Protection", "Warehouses"]
  },
  {
    id: 5,
    title: "Commercial Lease Insurance Requirements: Landlord vs. Tenant Responsibilities",
    slug: "blog-details-lease-requirements.html",
    category: "Industry Insights",
    excerpt: "Reviewing triple-net (NNN) commercial leases, Certificates of Insurance (COI) verification, and ensuring tenant improvements & betterments are adequately insured.",
    author: "Sophia Alvarez, Esq.",
    authorRole: "Commercial Legal Counsel",
    date: "Aug 12, 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    tags: ["Commercial Leases", "Tenants", "COI Compliance"]
  },
  {
    id: 6,
    title: "Parametric Weather Insurance: The Next Frontier in Commercial Property Resilience",
    slug: "blog-details-parametric.html",
    category: "Risk Management",
    excerpt: "How sensor-triggered payouts without loss adjusting disputes are bridging coverage gaps for coastal commercial real estate and industrial ports during catastrophic storms.",
    author: "David Chen, ARM",
    authorRole: "Risk Advisory Director",
    date: "Jul 22, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1454789476662-53eb23ba5907?auto=format&fit=crop&w=800&q=80",
    tags: ["Parametric", "Resilience", "Climate Risk"]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initBlogListing();
});

function initBlogListing() {
  const container = document.getElementById('blog-posts-grid');
  if (!container) return;

  const searchInput = document.getElementById('blog-search-input');
  const categoryPills = document.querySelectorAll('.category-filter-btn');
  const emptyState = document.getElementById('blog-empty-state');
  const loadMoreBtn = document.getElementById('blog-load-more-btn');

  let activeCategory = 'All';
  let searchTerm = '';
  let visibleCount = 6;

  function renderArticles() {
    let filtered = BLOG_ARTICLES.filter(item => {
      const matchesCat = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCat && matchesSearch;
    });

    if (emptyState) {
      if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        container.innerHTML = '';
        if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
        return;
      } else {
        emptyState.classList.add('hidden');
      }
    }

    const toShow = filtered.slice(0, visibleCount);
    container.innerHTML = toShow.map(item => `
      <article class="insurance-card bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col h-full group">
        <div class="relative h-56 overflow-hidden">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
          <div class="absolute top-4 left-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-navy/90 text-amber-400 backdrop-blur-md">
              ${item.category}
            </span>
          </div>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center text-xs text-slate-600 dark:text-slate-400 mb-3 space-x-3 font-medium">
              <span><i class="fa-regular fa-calendar mr-1"></i> ${item.date}</span>
              <span>•</span>
              <span><i class="fa-regular fa-clock mr-1"></i> ${item.readTime}</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">
              <a href="${item.slug}" class="text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors">${item.title}</a>
            </h3>
            <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3 font-normal">
              ${item.excerpt}
            </p>
          </div>
          <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between mt-auto">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center font-extrabold text-xs">
                ${item.author.split(' ').map(n=>n[0]).join('')}
              </div>
              <div class="text-xs">
                <p class="font-bold text-slate-900 dark:text-white">${item.author}</p>
                <p class="text-slate-600 dark:text-slate-400 font-medium">${item.authorRole}</p>
              </div>
            </div>
            <a href="${item.slug}" class="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
              Read <i class="fa-solid fa-arrow-right ml-1 text-xs"></i>
            </a>
          </div>
        </div>
      </article>
    `).join('');

    if (loadMoreBtn) {
      if (filtered.length <= visibleCount) {
        loadMoreBtn.classList.add('hidden');
      } else {
        loadMoreBtn.classList.remove('hidden');
      }
    }
  }

  // Bind category pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => {
        p.classList.remove('bg-amber-500', 'text-white', 'border-amber-500');
        p.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-700');
      });
      pill.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300', 'border-slate-200', 'dark:border-slate-700');
      pill.classList.add('bg-amber-500', 'text-white', 'border-amber-500');

      activeCategory = pill.getAttribute('data-category') || 'All';
      renderArticles();
    });
  });

  // Bind search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      renderArticles();
    });
  }

  // Load more button
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      visibleCount += 3;
      renderArticles();
    });
  }

  renderArticles();
}
