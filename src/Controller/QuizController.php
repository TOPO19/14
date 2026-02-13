<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class QuizController extends AbstractController
{
    // La bonne réponse est toujours à l'index 0 dans ce tableau source.
    // Elle sera mélangée dynamiquement à chaque chargement du quiz.
    private const QUESTIONS = [
        [
            'question' => 'Quel est le prénom de la femme qui fait battre mon cœur chaque jour ?',
            'choices' => ['Sima', 'Chaimaa', 'Chaimae'],
            'success' => 'Évidemment… il n\'y a que toi, Sima.',
        ],
        [
            'question' => 'Quelle est la date où notre histoire a commencé ?',
            'choices' => ['22/10/2018', '22/10/2017', '22/10/2019'],
            'success' => 'Tu t\'en souviens… ce jour a tout changé pour nous deux.',
        ],
        [
            'question' => 'Quelle est la date de nos fiançailles ?',
            'choices' => ['10/01/2026', '14/02/2026', '25/12/2025'],
            'success' => 'Le plus beau oui de ma vie… et le début de notre pour toujours.',
        ],
        [
            'question' => 'Quelle est notre ville d\'amour ?',
            'choices' => ['Chefchaouen', 'Al hoceima', 'Rabat'],
            'success' => 'La perle bleue… notre petit paradis à nous.',
        ],
        [
            'question' => 'Comment s\'appelle le petit cockatiel que je t\'ai offert ?',
            'choices' => ['Romeo', 'Athena', 'Renna'],
            'success' => 'Romeo… notre petit amoureux à plumes.',
        ],
        [
            'question' => 'Quel est ton plat préféré ?',
            'choices' => ['Tagine cheflore', 'Pizza', 'Sushi'],
            'success' => 'Un délice… tout comme toi.',
        ],
        [
            'question' => 'Quelle voiture je veux conduire quand on sera millionnaires ?',
            'choices' => ['Alfa Romeo Stelvio', 'BMW X5', 'Audi Q5'],
            'success' => 'Et c\'est toi qui seras à côté de moi.',
        ],
    ];

    /**
     * Mélange les choix de chaque question.
     * Retourne les questions avec un champ 'answer' correspondant
     * à la nouvelle position de la bonne réponse (index 0 d'origine).
     */
    private function shuffleQuestions(): array
    {
        $shuffled = [];

        foreach (self::QUESTIONS as $q) {
            $correctValue = $q['choices'][0];

            $choices = $q['choices'];
            shuffle($choices);

            $shuffled[] = [
                'question' => $q['question'],
                'choices' => $choices,
                'answer' => array_search($correctValue, $choices),
                'success' => $q['success'],
            ];
        }

        return $shuffled;
    }

    #[Route('/quiz', name: 'quiz')]
    public function index(Request $request): Response
    {
        $session = $request->getSession();
        $session->set('quiz_step', 0);
        $session->remove('quiz_completed');

        // Mélanger et stocker en session pour que check() utilise le même ordre
        $questions = $this->shuffleQuestions();
        $session->set('quiz_questions', $questions);

        return $this->render('quiz/index.html.twig', [
            'questions' => $questions,
        ]);
    }

    #[Route('/quiz/check', name: 'quiz_check', methods: ['POST'])]
    public function check(Request $request): Response
    {
        $session = $request->getSession();
        $questions = $session->get('quiz_questions', []);
        $step = (int) $request->request->get('step', 0);
        $choice = (int) $request->request->get('choice', -1);

        if ($step < 0 || $step >= count($questions)) {
            return $this->json(['error' => true], 400);
        }

        $question = $questions[$step];
        $correct = $choice === $question['answer'];

        if ($correct) {
            $session->set('quiz_step', $step + 1);

            if ($step + 1 >= count($questions)) {
                $session->set('quiz_completed', true);
            }
        }

        return $this->json([
            'correct' => $correct,
            'message' => $correct
                ? $question['success']
                : 'Hmm… réfléchis encore mon cœur ❤️',
            'finished' => $correct && ($step + 1 >= count($questions)),
        ]);
    }
}
