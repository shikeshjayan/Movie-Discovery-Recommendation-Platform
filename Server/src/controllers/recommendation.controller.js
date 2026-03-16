import User from "../models/user.model.js";
import Media from "../models/media.model.js";
import History from "../models/history.model.js";
import WatchLater from "../models/watchLater.model.js";
import Review from "../models/review.model.js";

const WEIGHTS = {
  history: 1,
  watchLater: 3,
  positiveReview: 5,
};

export const getRecommendations = async (req, res) => {
  try {
    const { type } = req.query;
    const userId = req.user._id;

    let baseQuery = {};
    if (type) baseQuery.mediaType = type;

    const [history, watchLater, reviews, similarUsers] = await Promise.all([
      History.find({ user: userId }).populate("media"),
      WatchLater.find({ user: userId }).populate("media"),
      Review.find({ user: userId }),
      User.find({
        _id: { $ne: userId },
        reviews: { $exists: true, $ne: [] },
      }).limit(50),
    ]);

    const interactedIds = new Set();
    const genreScores = {};
    const yearScores = [];
    const keywords = [];
    let totalWeight = 0;

    const addInteraction = (media, weight) => {
      if (!media || !media.tmdbId) return;
      const tmdbId = media.tmdbId;
      if (interactedIds.has(tmdbId)) return;
      interactedIds.add(tmdbId);

      (media.genres || []).forEach((genre) => {
        genreScores[genre] = (genreScores[genre] || 0) + weight;
      });

      if (media.releaseDate) {
        const year = new Date(media.releaseDate).getFullYear();
        yearScores.push(year);
      }

      if (media.overview) {
        const words = media.overview
          .toLowerCase()
          .split(/\W+/)
          .filter((w) => w.length > 3);
        keywords.push(...words.slice(0, 20));
      }

      totalWeight += weight;
    };

    history.forEach((h) => addInteraction(h.media, WEIGHTS.history));
    watchLater.forEach((w) => addInteraction(w.media, WEIGHTS.watchLater));
    reviews.forEach((r) => {
      const weight = r.rating >= 4 ? WEIGHTS.positiveReview : 0.5;
      const media = { tmdbId: r.movieId, genres: [], overview: "" };
      addInteraction(media, weight);
    });

    if (interactedIds.size === 0) {
      const topMedia = await Media.find(baseQuery)
        .sort({ voteAverage: -1, voteCount: -1 })
        .limit(20);
      return res.status(200).json({ success: true, data: topMedia });
    }

    const topGenres = Object.keys(genreScores)
      .sort((a, b) => genreScores[b] - genreScores[a])
      .slice(0, 5);

    let yearRange = null;
    if (yearScores.length > 0) {
      const avgYear = yearScores.reduce((a, b) => a + b, 0) / yearScores.length;
      yearRange = { min: avgYear - 10, max: avgYear + 2 };
    }

    const keywordCounts = {};
    keywords.forEach((kw) => {
      keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
    });
    const topKeywords = Object.keys(keywordCounts)
      .sort((a, b) => keywordCounts[b] - keywordCounts[a])
      .slice(0, 10);

    let collaborativeRecs = [];
    if (similarUsers.length > 0) {
      const userHistoryIds = Array.from(interactedIds);
      const similarUserIds = [];

      for (const user of similarUsers) {
        const userReviews = await Review.find({ user: user._id });
        const overlap = userReviews.some((r) => userHistoryIds.includes(r.movieId));
        if (overlap) {
          similarUserIds.push(user._id);
          if (similarUserIds.length >= 10) break;
        }
      }

      if (similarUserIds.length > 0) {
        const similarReviews = await Review.find({
          user: { $in: similarUserIds },
          rating: { $gte: 4 },
        });
        const recIds = similarReviews
          .map((r) => r.movieId)
          .filter((id) => !interactedIds.has(id));
        collaborativeRecs = await Media.find({
          tmdbId: { $in: recIds },
          ...baseQuery,
        }).limit(10);
      }
    }

    const candidateQuery = {
      tmdbId: { $nin: Array.from(interactedIds) },
      ...baseQuery,
    };

    if (topGenres.length > 0) {
      candidateQuery.genres = { $in: topGenres };
    }

    let candidates = await Media.find(candidateQuery).limit(100);

    if (yearRange) {
      candidates = candidates.filter((m) => {
        if (!m.releaseDate) return true;
        const year = new Date(m.releaseDate).getFullYear();
        return year >= yearRange.min && year <= yearRange.max;
      });
    }

    const scoredCandidates = candidates.map((media) => {
      let score = 0;

      const genreMatch = (media.genres || []).filter((g) => topGenres.includes(g)).length;
      score += genreMatch * 15;

      score += (media.voteAverage || 0) * 5;

      if (topKeywords.length > 0 && media.overview) {
        const overviewLower = media.overview.toLowerCase();
        const keywordMatch = topKeywords.filter((kw) => overviewLower.includes(kw)).length;
        score += keywordMatch * 3;
      }

      score += Math.log10((media.voteCount || 1) + 1) * 2;

      return { media, score };
    });

    scoredCandidates.sort((a, b) => b.score - a.score);
    const contentBasedRecs = scoredCandidates.slice(0, 15).map((c) => c.media);

    const finalRecs = [];
    const addedIds = new Set();

    for (const rec of [...collaborativeRecs, ...contentBasedRecs]) {
      if (!addedIds.has(rec.tmdbId)) {
        finalRecs.push(rec);
        addedIds.add(rec.tmdbId);
        if (finalRecs.length >= 20) break;
      }
    }

    res.status(200).json({ success: true, data: finalRecs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
